/**
 * 
 * @typedef {{
 * 		_id: import("mongoose").Types.ObjectId,
 * 		username: string,
 * 		profilePicture: string,
 *    gender: "male" | "female",
 * 		createdAt: NativeDate,
 * 		updatedAt: NativeDate,
 *    __v: any,
 * 	}} User
 * 
 * @typedef {import("express").Request & {
 *  cookies: Record<string, string | undefined> // import("cookie-parser").CookieParseOptions,
 * }} ExpressRequest
 *
 * @typedef {ExpressRequest & {
 * 	user: User
 * }} ProtectedRequest

 * @typedef {ExpressRequest & {
 * 	user?: User
 * }} ProtectedMiddlewareRequest
 *
 * @typedef {(req: any, res: import("express").Response, next: import("express").NextFunction) => Promise<any> | any} ExpressAnyController
 *
 * @typedef {(req: ExpressRequest, res: import("express").Response, next: import("express").NextFunction) => Promise<any> | any} ExpressController
 *
 * @typedef {(req: ProtectedRequest, res: import("express").Response, next: import("express").NextFunction) => Promise<any> | any} ExpressProtectedController
 * 
 * @typedef {(req: ProtectedMiddlewareRequest, res: import("express").Response, next: import("express").NextFunction) => Promise<any> | any} ExpressProtectedRoutesMiddleware
 */

export {};
