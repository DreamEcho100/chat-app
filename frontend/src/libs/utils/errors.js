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
