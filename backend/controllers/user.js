import User from "../models/user.js";

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedController}*/
export async function getUsersForSidebarController(req, res) {
	const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

	res.status(200).json(users);
}
