import express from "express";
import { getMessagesController, sendMessageController } from "../controllers/message.js";
import { asyncErrorHandler } from "../libs/utils/errors.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const messageRoutes = express.Router();

messageRoutes.post("/send/:id", protectedRoute, asyncErrorHandler(sendMessageController));
messageRoutes.get("/:id", protectedRoute, asyncErrorHandler(getMessagesController));

export default messageRoutes;
