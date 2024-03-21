import User from "../models/user.js";
import { isValidObjectId } from "mongoose";

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedController}*/
export async function getUsersForSidebarController(req, res) {
	const loggedInUserId = req.user._id;
	const users = await User.find({
		_id: { $ne: loggedInUserId },
	}).select("-password");

	res.status(200).json({ data: users });
}
