import zodFormDataValidator from "../../zod/form-data-validator";
import useMutationManager from "./mutation-manager";

/**
 * @template Result
 * @template {import("zod").ZodSchema} ZodSchema
 *
 * @param {Omit<import("./mutation-manager").useMutationManagerParams<Result, import("react").FormEvent<HTMLFormElement>, ReturnType<ZodSchema["parse"]>>, 'getInputData'> & {
 * 	schema?: ZodSchema;
 * 	resetFormOnSuccess?: boolean;
 * }} params
 */
export default function useFormManager(params) {
	const { handleOnSubmit, isLoading } = useMutationManager({
		getInputData: /** @param {import("react").FormEvent<HTMLFormElement>} event */ (event) => {
			event.preventDefault();
			const formData = new FormData(/** @type {HTMLFormElement} */ (event.target));
			return params.schema ? zodFormDataValidator(formData, params.schema) : undefined;
		},
		mutationFn: params.mutationFn,
		onSuccess: (result, event) => {
			params.onSuccess?.(result, event);
			if (params.resetFormOnSuccess) {
				/** @type {HTMLFormElement} */ (event.target).reset();
			}
		},
		onError: params.onError,
		onAllSettled: params.onAllSettled,
		stopDefault: params.stopDefault,
	});

	return { handleOnSubmit, isLoading };
}
