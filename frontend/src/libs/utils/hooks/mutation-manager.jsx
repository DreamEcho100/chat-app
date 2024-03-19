import { useState } from "react";
import toast from "react-hot-toast";

/**
 * @template Result
 * @template MutationParams
 * @template Input
 *
 * @typedef {{
 *  getInputData: (params: MutationParams) => Input;
 * 	mutationFn: (input: Input) => Promise<Response>;
 *  onSuccess: (result: Result, params: MutationParams) => void;
 *  onError?: (error: Error) => void;
 *  onAllSettled?: () => void;
 *  stopDefault?: { errorHandling?: boolean, successHandling?: boolean }
 * }} useMutationManagerParams
 */

/**
 * @template Result
 * @template MutationParams
 * @template Input
 *
 * @param {useMutationManagerParams<Result, MutationParams, Input>} params
 */
export default function useMutationManager(params) {
	const [isLoading, setIsLoading] = useState(false);

	/** @param {MutationParams} mutationParams */
	async function handleMutation(mutationParams) {
		if (isLoading) return;

		setIsLoading(true);

		try {
			const input = params.getInputData(mutationParams);

			const response = await params.mutationFn(input);

			if (!response.ok || response.status >= 400) {
				const result = await response.json();
				throw new Error(result.message);
			}

			const result = /** @type {Result} */ await response.json();

			if (!params.stopDefault?.successHandling) {
				toast.success("Successful operation", { icon: "🚀" });
			}

			params.onSuccess(result, mutationParams);
		} catch (error) {
			if (!params.stopDefault?.errorHandling) {
				if (error instanceof Error) {
					console.error(`Error ticket: ${error.message}`);
					toast.error(
						<pre className="whitespace-pre-wrap">
							<code>{error.message}</code>
						</pre>,
						{ icon: "🚨" },
					);
				} else {
					console.error(`Error ticket: ${error}`);
					toast.error(
						<pre className="whitespace-pre-wrap">
							<code>{"An error occurred" + "\n" + JSON.stringify(error, null, 2)}</code>
						</pre>,
						{
							icon: "🚨",
						},
					);
				}
			}

			params.onError?.(/** @type {Error} */ (error));
		} finally {
			setIsLoading(false);

			params.onAllSettled?.();
		}
	}

	return { handleOnSubmit: handleMutation, isLoading };
}
