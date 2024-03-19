import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: true,
			minlength: 1,
			trim: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
