import { z } from "zod";

/**
 * @param {import('express').Response} res
 * @param {unknown} err
 */
export function expressErrorFormatter(res, err) {
	console.error(err);
	if (err instanceof z.ZodError) {
		res.status(400).json({
			message: "Validation failed",
			errors: err.errors,
		});
	} else {
		res.status(res.statusCode ?? 500).json({
			message: res.statusMessage ?? "Something went wrong",
		});
	}
}

/**
 * @param {import('./types/index.d.ts').ExpressAnyController} fn
 * @description This function is used to handle async errors in the controllers.
 */
export function asyncErrorHandler(fn) {
	/** @type {import('./types/index.d.ts').ExpressAnyController} */
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (err) {
			// return next(e);
			expressErrorFormatter(res, err);
		}
	};
}
