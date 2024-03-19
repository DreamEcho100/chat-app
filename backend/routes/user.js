import express from "express";
import { getUsersForSidebarController } from "../controllers/user.js";
import { asyncErrorHandler } from "../libs/utils/errors.js";

const usersRoutes = express.Router();

usersRoutes.get("/", asyncErrorHandler(getUsersForSidebarController));

export default usersRoutes;
