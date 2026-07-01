import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'text is required', success: false });
    }

    const comment = await Comment.create({
      content,
      userId: commentKrneWalaUserKiId,
      postId: postId
    });

    const [populatedComment, blogUpdate] = await Promise.all([
      comment.populate({
        path: 'userId',
        select: 'firstName lastName photoUrl'
      }),
      Blog.updateOne({ _id: postId }, { $push: { comments: comment._id } })
    ]);

    if (blogUpdate.matchedCount === 0) {
      await Comment.deleteOne({ _id: comment._id });
      return res.status(404).json({ message: 'Blog post not found', success: false });
    }

    return res.status(201).json({
      message: 'Comment Added',
      comment: populatedComment,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating comment", error: error.message });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    
    const comments = await Comment.find({ postId: blogId })
      .populate({ path: 'userId', select: 'firstName lastName photoUrl' })
      .sort({ createdAt: -1 })
      .lean();

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this blog', success: false });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching comments", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id;

    const comment = await Comment.findById(commentId).select('userId postId').lean();

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
    }

    const blogId = comment.postId;

    await Promise.all([
      Comment.deleteOne({ _id: commentId }),
      Blog.updateOne({ _id: blogId }, { $pull: { comments: commentId } })
    ]);

    return res.status(200).json({ success: true, message: 'Comment deleted Successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting comment", error: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const userId = req.id;
    const { content } = req.body;
    const commentId = req.params.id;

    const commentCheck = await Comment.findById(commentId).select('userId').lean();
    if (!commentCheck) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (commentCheck.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content, editedAt: new Date() } },
      { new: true, lean: true }
    );

    return res.status(200).json({ success: true, message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Comment is not edited", error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const userId = req.id;
    const commentId = req.params.id;

    const commentCheck = await Comment.findById(commentId).select('likes').lean();
    if (!commentCheck) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const alreadyLiked = commentCheck.likes.map(id => id.toString()).includes(userId);
    
    const updateQuery = alreadyLiked 
      ? { $pull: { likes: userId }, $inc: { numberOfLikes: -1 } }
      : { $addToSet: { likes: userId }, $inc: { numberOfLikes: 1 } };

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updateQuery, { new: true })
      .populate("userId", "firstName lastName photoUrl");

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      updatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while liking the comment",
      error: error.message,
    });
  }
};

export const getAllCommentsOnMyBlogs = async (req, res) => {
  try {
    const userId = req.id;

    const myBlogs = await Blog.find({ author: userId }).select("_id").lean();
    const blogIds = myBlogs.map(blog => blog._id);

    if (blogIds.length === 0) {
      return res.status(200).json({
        success: true,
        totalComments: 0,
        comments: [],
        message: "No blogs found for this user.",
      });
    }

    const comments = await Comment.find({ postId: { $in: blogIds } })
      .populate("userId", "firstName lastName email")
      .populate("postId", "title")
      .lean();

    return res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get comments.",
    });
  }
};