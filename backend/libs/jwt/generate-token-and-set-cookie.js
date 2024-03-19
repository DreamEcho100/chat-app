import jwt from "jsonwebtoken";
import { BACKEND_ENV } from "../utils/env.js";
import { FIFTEEN_DAYS_IN_MILLISECONDS, JWT_TOKEN_COOKIE_NAME } from "../utils/constants.js";

/**
 * Generate a token for the user
 * @param {string | import("mongoose").Types.ObjectId} userId
 * @param {import("express").Response} res
 */
export default function generateToken(userId, res) {
	// JWT_SECRET can be generated in bash using `openssl rand -base64 32`
	const token = jwt.sign({ userId }, BACKEND_ENV.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie(JWT_TOKEN_COOKIE_NAME, token, {
		httpOnly: true,
		maxAge: FIFTEEN_DAYS_IN_MILLISECONDS,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});
}
