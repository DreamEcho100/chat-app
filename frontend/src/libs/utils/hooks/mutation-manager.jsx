import { useState } from "react";
import toast from "react-hot-toast";

/**
 * @template Data
 * @template MutationParams
 * @template Input
 *
 * @typedef {{
 *  getInputData: (params: MutationParams) => Input;
 * 	mutationFn: (input: Input) => Promise<Response>;
 *  onSuccess: (Data: Data, params: MutationParams) => void;
 *  onError?: (error: Error) => void;
 *  onAllSettled?: () => void;
 *  stopDefault?: { errorHandling?: boolean, successHandling?: boolean }
 * }} useMutationManagerParams
 */

/**
 * @template Data
 * @template MutationParams
 * @template Input
 *
 * @param {useMutationManagerParams<Data, MutationParams, Input>} params
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
				const Data = await response.json();
				throw new Error(Data.message);
			}

			const Data = /** @type {Data} */ await response.json();

			if (!params.stopDefault?.successHandling) {
				toast.success("Successful operation", { icon: "🚀" });
			}

			params.onSuccess(Data, mutationParams);
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
