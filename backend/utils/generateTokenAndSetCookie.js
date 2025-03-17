import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    // Ensure SECRET_KEY is defined
    if (!process.env.SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined in the environment variables');
    }

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};