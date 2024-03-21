import express from "express";
import { getUsersForSidebarController } from "../controllers/user.js";
import { asyncErrorHandler } from "../libs/utils/errors.js";
import protectedRoutesMiddleware from "../middlewares/protectedRoute.js";

const usersRoutes = express.Router();

usersRoutes.get("/", protectedRoutesMiddleware, asyncErrorHandler(getUsersForSidebarController));

export default usersRoutes;
