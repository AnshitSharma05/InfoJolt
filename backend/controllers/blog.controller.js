import { Blog } from "../models/blog.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: "Blog title and category is required." });
        }
        const blog = await Blog.create({ title, category, author: req.id });
        return res.status(201).json({ success: true, blog, message: "Blog Created Successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create blog" });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const { title, subtitle, description, category } = req.body;
        const file = req.file;
        const updateData = { title, subtitle, description, category, author: req.id };

        if (file) {
            const fileUri = getDataUri(file);
            const thumbnail = await cloudinary.uploader.upload(fileUri);
            updateData.thumbnail = thumbnail.secure_url;
        }

        const blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true }).populate("author");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }
        res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
};

export const getAllBlogs = async (_, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'firstName lastName photoUrl' }
        }).lean();
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
};

export const getPublishedBlog = async (_, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).populate({
            path: "author", 
            select: "firstName lastName photoUrl"
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'firstName lastName photoUrl' }
        }).lean();
        if (!blogs) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.status(200).json({ success: true, blogs });
    } catch (error) {
        return res.status(500).json({ message: "Failed to get published blogs" });
    }
};

export const togglePublishBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        return res.status(200).json({ success: true, message: `Blog is ${blog.isPublished ? "Published" : "Unpublished"}` });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update status" });
    }
};

export const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const blogs = await Blog.find({ author: userId }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'firstName lastName photoUrl' }
        }).lean();
        return res.status(200).json({ blogs, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== authorId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this blog' });
        }
        await Promise.all([
            Blog.findByIdAndDelete(blogId),
            Comment.deleteMany({ postId: blogId })
        ]);
        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.id;
        const blog = await Blog.findByIdAndUpdate(blogId, { $addToSet: { likes: userId } }, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found', success: false });
        return res.status(200).json({ message: 'Blog liked', blog, success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error liking blog" });
    }
};

export const dislikeBlog = async (req, res) => {
    try {
        const userId = req.id;
        const blogId = req.params.id;
        const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: userId } }, { new: true });
        if (!blog) return res.status(404).json({ message: 'Post not found', success: false });
        return res.status(200).json({ message: 'Blog disliked', blog, success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error disliking blog" });
    }
};

export const getMyTotalBlogLikes = async (req, res) => {
    try {
        const userId = req.id;
        const myBlogs = await Blog.find({ author: userId }).select("likes").lean();
        const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
        res.status(200).json({ success: true, totalBlogs: myBlogs.length, totalLikes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch total blog likes" });
    }
};

export const aiCorrectBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: "Gemini API key is missing from environment variables (.env)." });
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Correct grammatical and spelling errors in the following title and HTML content. Do NOT rewrite the whole blog, ONLY correct grammar and spelling mistakes. Keep all HTML tags exactly as they are. Return a strictly valid JSON object with exactly two keys: "title" (the corrected title) and "description" (the corrected HTML content). \nTitle to correct: ${title}\nContent to correct: ${description}`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        let text = result.response.text();
        text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const corrected = JSON.parse(text);

        res.status(200).json({
            success: true,
            title: corrected.title,
            description: corrected.description,
            message: "Corrected successfully using AI!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to correct content using AI: " + error.message });
    }
};