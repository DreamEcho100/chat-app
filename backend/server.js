// https://www.npmjs.com/package/module-alias
// https://stackoverflow.com/questions/62449393/node-unable-to-find-module-alias-defined-in-tsconfig-and-package-json
// import "module-alias/register.js";
// import moduleAlias from "module-alias";
// moduleAlias.addAlias("~", process.cwd() + "/backend");
// moduleAlias();

import express from "express";
import { ZodError } from "zod";
import connectToMongoDB from "./libs/db/mongoose/connect.js";
import { BACKEND_ENV } from "./libs/utils/env.js";
import { expressErrorResponse } from "./libs/utils/errors.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/user.js";
import { app, io, server } from "./libs/socket.js";

app.use(express.json());
app.use(cookieParser());

app.use(
	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 * @param {import("express").NextFunction} next
	 */
	(req, res, next) => {
		/** @type {{ io: typeof io } & import("express").Request} */ (req).io = io;

		next();
	},
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
	res.status(404).send("Not Found");
});

app.use(
	/**
	 * @param {Error} err
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 * @param {import("express").NextFunction} next
	 */
	(err, req, res, next) => {
		expressErrorResponse(res, err);
		next();
	},
);

server.listen(BACKEND_ENV.PORT, async () => {
	await connectToMongoDB();
	console.log(`Server is running on http://localhost:${BACKEND_ENV.PORT}`);
});
