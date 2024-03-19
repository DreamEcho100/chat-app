import { Request } from "express";

export interface User {
	_id: import("mongoose").Types.ObjectId;
	username: string;
	profilePicture: string;
	gender: "male" | "female";
	createdAt: NativeDate;
	updatedAt: NativeDate;
	__v: any;
}

export interface ExpressRequest extends Request {
	cookies: Record<string, string | undefined>; // import("cookie-parser").CookieParseOptions,
}

export interface ProtectedRequest extends ExpressRequest {
	user: User;
}

export interface ProtectedMiddlewareRequest extends ExpressRequest {
	user?: User;
}

export type ExpressAnyController = (
	req: any,
	res: import("express").Response,
	next: import("express").NextFunction,
) => Promise<any> | any;

export type ExpressController = (
	req: ExpressRequest,
	res: import("express").Response,
	next: import("express").NextFunction,
) => Promise<any> | any;

export type ExpressProtectedController = (
	req: ProtectedRequest,
	res: import("express").Response,
	next: import("express").NextFunction,
) => Promise<any> | any;

export type ExpressProtectedRoutesMiddleware = (
	req: ProtectedMiddlewareRequest,
	res: import("express").Response,
	next: import("express").NextFunction,
) => Promise<any> | any;
