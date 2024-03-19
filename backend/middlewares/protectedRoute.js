import jwt from "jsonwebtoken";
import { BACKEND_ENV } from "../libs/utils/env.js";
import User from "../models/user.js";

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedRoutesMiddleware} */
export default async function protectedRoutesMiddleware(req, res, next) {
	const token = req.cookies.token;

	if (typeof token !== "string") {
		return res.status(401).json({
			message: "Unauthorized - No token provided",
		});
	}

	const decoded = /** @type {{ userId: string } & import("jsonwebtoken").JwtPayload} */ (
		jwt.verify(token, BACKEND_ENV.JWT_SECRET)
	);

	if (!decoded) {
		return res.status(401).json({
			message: "Unauthorized - Invalid token",
		});
	}

	const user = await User.findById(decoded.userId).select("-password");

	if (!user) {
		return res.status(401).json({
			message: "User not found",
		});
	}

	req.user = {
		_id: user._id,
		username: user.username,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		__v: user.__v,
		gender: user.gender,
		profilePicture: user.profilePicture,
	};

	next();
}
