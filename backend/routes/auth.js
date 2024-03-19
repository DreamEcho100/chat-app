import express from "express";
import { getAuthUser, loginController, logoutController, signupController } from "../controllers/auth.js";
import { asyncErrorHandler } from "../libs/utils/errors.js";
import protectedRoutesMiddleware from "../middlewares/protectedRoute.js";

const authRoutes = express.Router();

authRoutes.post("/signup", asyncErrorHandler(signupController));

authRoutes.post("/login", asyncErrorHandler(loginController));

authRoutes.post("/logout", asyncErrorHandler(logoutController));

authRoutes.get("/me", protectedRoutesMiddleware, asyncErrorHandler(getAuthUser));

export default authRoutes;
