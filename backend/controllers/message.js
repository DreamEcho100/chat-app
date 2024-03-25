import { z } from "zod";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { getReceiverSocketId } from "../libs/socket.js";

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
	// req.io
	await Promise.all([newMessage.save(), conversation.save()]);

	const receiverSocketId = getReceiverSocketId(receiverId);
	if (receiverSocketId) {
		// io.to(<socket_id>).emit() used to send events to specific client
		// @ts-ignore
		// const io = req.app.get("io");
		req.io.to(receiverSocketId).emit("newMessage", newMessage);
		// io.to(receiverSocketId).emit("new-message", newMessage);
	}

	// Socket io functionality will go here

	res.status(201).json(newMessage);
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

	if (!conversation) {
		return res.status(200).json([]);
	}

	res.status(200).json(conversation.messages);
}
