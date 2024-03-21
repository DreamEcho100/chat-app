import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getFormattedErrorMessage } from "../errors";

/**
 * @template Data
 * @template Input
 *
 * @typedef {{
 *  input?: Input;
 *  queryKey: string;
 * 	queryFn: (input: Input) => Promise<Response>;
 *  onSuccess: (Data: Data, params: { input: Input }) => void;
 *  onError?: (error: Error) => void;
 *  onAllSettled?: () => void;
 *  stopDefault?: { errorHandling?: boolean, successHandling?: boolean }
 * }} useQueryManagerParams
 */

/**
 *
 * @typedef {{
 * 	type: 'loading' | 'idle';
 * 	isLoading: true;
 * 	data: null;
 * 	error: null;
 * }} LoadingOrIdleQueryState
 *
 * @typedef {{
 * 	type: 'error';
 * 	isLoading: false;
 * 	data: null;
 * 	error: Error;
 * }} ErrorQueryState
 */
/**
 * @template Data
 *
 * @typedef {{
 * 	type: 'success';
 * 	isLoading: false;
 * 	data: Data;
 * 	error: null;
 * }} SuccessQueryState
 */

/**
 *
 * @typedef {{
 *  cacheStore: Record<string, unknown>
 *  isCacheHit: boolean
 *  cacheTime: number
 * }} BaseConfig
 */

/**
 * @template Data
 * @template Input
 *
 * @param {useQueryManagerParams<Data, Input>} params
 */
export default function useQueryManager(params) {
	// const [isLoading, setIsLoading] = useState(false);
	// const [Data, setData] = useState(/** @type {Data | null} */(null))
	const [query, setQuery] = useState(
		/**
		 * @type {LoadingOrIdleQueryState | ErrorQueryState | SuccessQueryState<Data>}
		 */
		({
			type: "idle",
			isLoading: true,
			data: null,
			error: null,
		}),
	);

	const configRef = useRef(
		/** @type {BaseConfig} */ ({
			cacheStore: {},
		}),
	);

	const handleQueryCall = useCallback(
		/** @param {Input} input */
		async function (input) {
			const cacheKey = JSON.stringify([params.queryKey, params.input]);

			if (query.type !== "idle") return;

			setQuery((prev) => ({
				...prev,
				type: "loading",
				isLoading: true,
				data: null,
				error: null,
			}));

			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const response = await params.queryFn(input);

				if (!response.ok || response.status >= 400) {
					const Data = await response.json();
					throw new Error(Data.message);
				}

				const data = /** @type {Data} */ await response.json();

				setQuery((prev) => ({
					...prev,
					type: "success",
					isLoading: false,
					data: data,
					error: null,
				}));

				if (!params.stopDefault?.successHandling) {
					toast.success("Successful operation", { icon: "🚀" });
				}

				configRef.current.cacheStore[cacheKey] = data;
				params.onSuccess(data, { input });
			} catch (error) {
				if (!params.stopDefault?.errorHandling) {
					const errorMessage = getFormattedErrorMessage(error);

					console.error(`Error ticket: ${errorMessage}`);

					toast.error(
						<pre className="whitespace-pre-wrap">
							<code>{errorMessage}</code>
						</pre>,
						{ icon: "🚨" },
					);
				}

				setQuery((prev) => ({
					...prev,
					type: "error",
					isLoading: false,
					data: null,
					error: /** @type {Error} */ (error),
				}));

				params.onError?.(/** @type {Error} */ (error));
			} finally {
				params.onAllSettled?.();
			}
		},
		[params, query.type],
	);

	useEffect(() => {
		if (query.type === "success") return;

		const cacheKey = JSON.stringify([params.queryKey, params.input]);

		if (configRef.current.cacheStore[cacheKey]) {
			setQuery((prev) => ({
				...prev,
				type: "success",
				isLoading: false,
				data: /** @type {Data} */ (configRef.current.cacheStore[cacheKey]),
				error: null,
			}));

			return;
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		handleQueryCall(params.input);
	}, [handleQueryCall, params.input, params.queryKey, query.type]);

	return { handleQueryCall, query };
}
