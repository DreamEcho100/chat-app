import type { NextFunction, Request, Response } from "express";
import type { io } from "~/libs/socket.js";

export interface User {
	_id: import("mongoose").Types.ObjectId;
	username: string;
	profilePicture: string;
	gender: "male" | "female";
	createdAt: NativeDate;
	updatedAt: NativeDate;
	__v: any;
}

/*
export interface EventsMap {
	[event: string]: any;
}
type ListenEvents = EventsMap;
type EmitEvents = EventsMap;
type ServerSideEvents = EventsMap;
type SocketData = any;

type IO = Server<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;

*/
export interface ExpressRequest extends Request {
	cookies: Record<string, string | undefined>;
	io: typeof io;
}

export interface ProtectedRequest extends ExpressRequest {
	user: User;
}

export interface ProtectedMiddlewareRequest extends ExpressRequest {
	user?: User;
}

export type ExpressAnyController = (req: any, res: Response, next: NextFunction) => Promise<any> | any;

export type ExpressController = (req: ExpressRequest, res: Response, next: NextFunction) => Promise<any> | any;

export type ExpressProtectedController = (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
) => Promise<any> | any;

export type ExpressProtectedRoutesMiddleware = (
	req: ProtectedMiddlewareRequest,
	res: Response,
	next: NextFunction,
) => Promise<any> | any;

export type ExpressMiddleware = (req: ExpressRequest, res: Response, next: NextFunction) => Promise<any> | any;
