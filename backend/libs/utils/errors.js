import { z } from "zod";

/** @param {unknown} err */
export function getFormattedErrorMessage(err) {
	let message = "Something went wrong";

	if (err instanceof z.ZodError) {
		message = err.errors.map((error) => `${error.path.join(".")}: ${error.message}.`).join(" \n\n");
	} else if (err instanceof Error) {
		message = err.message;
	}

	return message;
}

/**
 * @param {import('express').Response} res
 * @param {unknown} err
 */
export function expressErrorResponse(res, err) {
	console.error(err);

	const errorMessage = getFormattedErrorMessage(err);
	const errorStatusCode = err instanceof z.ZodError ? 400 : res.statusCode ?? 500;

	res.status(400).json({
		message: errorMessage,
		errors: errorStatusCode,
	});
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
			expressErrorResponse(res, err);
		}
	};
}
