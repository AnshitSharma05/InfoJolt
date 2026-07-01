import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { authCookieOptions } from "../utils/authCookie.js";
 
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const TOKEN_EXPIRY_MS = 1 * 24 * 60 * 60 * 1000; 

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const emailExists = await User.exists({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Account Created Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to register"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email }).select("password firstName lastName").lean();
        if (!user) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        delete user.password;

        return res.status(200)
            .cookie("token", token, authCookieOptions(TOKEN_EXPIRY_MS))
            .json({
                success: true,
                message: `Welcome back ${user.firstName}`,
                user
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to Login"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password").lean();
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
};

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { ...authCookieOptions(0), maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to logout" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;
        const file = req.file;

        let photoUrl;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            photoUrl = cloudResponse.secure_url;
        }

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (occupation) updateFields.occupation = occupation;
        if (instagram) updateFields.instagram = instagram;
        if (facebook) updateFields.facebook = facebook;
        if (linkedin) updateFields.linkedin = linkedin;
        if (github) updateFields.github = github;
        if (bio) updateFields.bio = bio;
        if (photoUrl) updateFields.photoUrl = photoUrl;

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updateFields }, 
            { new: true, runValidators: true }
        ).select("-password").lean();

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: updatedUser
        });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').limit(100).lean(); 
        return res.status(200).json({
            success: true,
            message: "User list fetched successfully",
            total: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};