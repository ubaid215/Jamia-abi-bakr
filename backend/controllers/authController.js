const User = require('../models/user');
const crypto = require('crypto');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendWelcomeEmail, sendForgetEmail } = require('../mailtrap/emails');
const bcrypt = require('bcryptjs');

// Generate a 6-digit numeric verification token
const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user' // Default role is 'user'
        });

        // Generate email verification token using the local function
        const verificationToken = generateVerificationToken();

        // Set verification token and expiration in the user document
        user.verificationToken = verificationToken;
        user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        await user.save({ validateBeforeSave: false });

        // Create verification URL
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

        // Simulate sending an email (for now, log the URL to the console)
        console.log('Verification URL:', verificationUrl);

        // Generate JWT token and set it as a cookie
        const token = generateTokenAndSetCookie(res, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        // Prepare the response object with user details
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Verification email sent to ' + user.email,
            token, // Include token explicitly in the response
            user: userResponse // Include user details in the response
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body; // Get token from request body instead of params

        // Find the user with the matching verification token
        const user = await User.findOne({
            verificationToken: code,
            verificationExpire: { $gt: Date.now() } // Check if the token is not expired
        });

        // If no user is found or the token is expired
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Please verify your email to login'
            });
        }

        // Update the lastLogin field
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Generate JWT token and set it as a cookie
        const token = generateTokenAndSetCookie(res, user._id);

        // Prepare the response object
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out Successfuly" });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash the token and set it in the user document
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiration (10 minutes from now)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        // Send forget password email
        const emailResult = await sendForgetEmail(user.email, resetUrl);
        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send forget password email'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Forget password email sent successfully'
        });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Check if password is provided
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        // Find the user with the matching reset token
        const user = await User.findOne({
            resetPasswordToken: crypto
                .createHash('sha256')
                .update(token)
                .digest('hex'),
            resetPasswordExpire: { $gt: Date.now() } // Check if the token is not expired
        });

        // If no user is found or the token is expired
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save the updated user document
        await user.save({ validateBeforeSave: false });

        // Send a confirmation email
        const emailResult = await sendResetPasswordEmail(user.email, "Your password has been reset successfully.");
        if (!emailResult.success) {
            console.error(emailResult.message);
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    verifyEmail,
    logout,
    login,
    forgotPassword,
    resetPassword
};