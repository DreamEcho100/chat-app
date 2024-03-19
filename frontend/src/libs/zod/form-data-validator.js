/**
 * @param {FormData} formData
 * @param {import("zod").ZodSchema} schema
 */
export default function zodFormDataValidator(formData, schema) {
	const inputResult = schema.safeParse(Object.fromEntries(formData.entries()));

	if (!inputResult.success) {
		const errorMessage = `Invalid input: ${inputResult.error.errors
			.map((error) => {
				return `${error.path.join(".")}: ${error.message}`;
			})
			.join("\n")}`;

		throw new Error(errorMessage);
	}

	return inputResult.data;
}
