import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
			minlength: 3,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			minlength: 3,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			default: "male",
		},
		profilePicture: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", userSchema);

export { userSchema, User };

export default User;
