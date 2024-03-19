import bycrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/user.js";
import generateTokenAndSetCookie from "../libs/jwt/generate-token-and-set-cookie.js";
import { JWT_TOKEN_COOKIE_NAME } from "../libs/utils/constants.js";

/**
 * @param {string} username
 * @param {"male" | "female"} gender
 */
function generateDefaultUserProfilePicture(username, gender) {
	return `https://avatars.iran.liara.run/public/${gender === "female" ? "girl" : "boy"}/?username=${username}`;
	// return `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200&bold=true&rounded=true&length=1&font-size=0.33&uppercase=true`
}

/** @type {import("~/libs/utils/types/index.d.ts").ExpressController} */
export async function signupController(req, res) {
	const signupSchema = z.object({
		fullName: z.string().min(3).max(120),
		username: z.string().min(3).max(120),
		password: z.string().min(8).max(120),
		confirmPassword: z.string().min(8).max(120),
		gender: z.enum(["male", "female"]).default("male"),
	});

	const input = signupSchema.parse(req.body);

	if (input.password !== input.confirmPassword) {
		return res.status(400).json({
			message: "Password and confirm password do not match",
		});
	}

	const existingUser = await User.findOne({ username: input.username });

	if (existingUser) {
		return res.status(400).json({
			message: "User already exists",
		});
	}

	const salt = await bycrypt.genSalt(8);
	const hashedPassword = await bycrypt.hash(input.password, salt);

	const newUser = new User({
		...input,
		profilePicture: generateDefaultUserProfilePicture(input.username, input.gender),
		password: hashedPassword,
	});

	await newUser.save();

	generateTokenAndSetCookie(newUser._id, res);

	// Remove password from the response
	// @ts-ignore
	newUser.password = undefined;

	res.status(201).json(newUser);
}

/** @type {import("~/libs/utils/types/index.d.ts").ExpressController} */
export async function loginController(req, res) {
	const signupSchema = z.object({
		username: z.string().min(3),
		password: z.string().min(8),
	});

	const input = signupSchema.parse(req.body);

	const user = await User.findOne({ username: input.username });

	if (!user) {
		return res.status(400).json({
			message: "Invalid username",
		});
	}

	const validPassword = await bycrypt.compare(input.password, user.password);

	if (!validPassword) {
		return res.status(400).json({
			message: "Invalid password",
		});
	}

	generateTokenAndSetCookie(user._id, res);

	// Remove password from the response
	// @ts-ignore
	user.password = undefined;

	res.status(200).json(user);
}

/** @type {import("~/libs/utils/types/index.d.ts").ExpressController} */
export function logoutController(req, res) {
	res.cookie(JWT_TOKEN_COOKIE_NAME, "", {
		maxAge: 0,
		// httpOnly: true,
		// sameSite: "strict",
		// secure: process.env.NODE_ENV === "production",
	});

	res.status(200).json({ message: "Logged out successfully" });
}

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedController}*/
export async function getAuthUser(req, res) {
	// Remove password from the response
	// @ts-ignore
	req.user.password = undefined;

	res.status(200).json(req.user);
}
