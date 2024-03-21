import { z } from "zod";
import User from "../models/user.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedController} */
export async function sendMessageController(req, res) {
	const schema = z.object({
		content: z.string().min(1),
	});

	const input = schema.parse(req.body);

	const sender = req.user;
	const senderId = req.user._id;
	const receiverId = req.params.id;

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		conversationId: conversation._id,
		senderId: senderId,
		receiverId,
		content: input.content,
	});

	if (newMessage) {
		conversation.messages.push(newMessage._id);
	}

	await Promise.all([newMessage.save(), conversation.save()]);

	res.status(201).json(newMessage);

	// Socket io functionality will go here
	// // Send notification to the receiver
	// // @ts-ignore
	// const io = req.app.get("io");
	// io.to(receiverId).emit("new-message", message);
}

/** @type {import("~/libs/utils/types/index.d.ts").ExpressProtectedController}*/
export async function getMessagesController(req, res) {
	const senderId = req.user._id;
	const receiverId = req.params.id;

	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	}).populate("messages"); // Not reference but actual messages

	console.log("[senderId, receiverId]", [senderId, receiverId]);
	console.log("conversation", conversation);

	if (!conversation) {
		return res.status(200).json([]);
	}

	res.status(200).json(conversation.messages);
}
