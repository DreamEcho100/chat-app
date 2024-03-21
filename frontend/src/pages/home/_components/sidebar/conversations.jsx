import { useMemo } from "react";
import useQueryManager from "../../../../libs/utils/hooks/query-manager";
import Conversation from "./conversation";

/** @param {{ input?: undefined; }} props */
export default function Conversations(props) {
	const { query } = useQueryManager({
		queryKey: "conversations",
		input: props.input,
		queryFn: async () => {
			return await fetch("/api/users");
		},
		/** @param {{ data: import("../../../../libs/utils/types").Conversation[] }} _data */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSuccess: (_data) => {
			console.log("Success getting conversations");
		},
		stopDefault: { successHandling: true },
	});

	const conversations = useMemo(() => query.data?.data ?? [], [query.data?.data]);

	if (query.error) {
		return <div>{query.error.message}</div>;
	}

	if (query.isLoading) {
		return <span className="loading loading-spinner" />;
	}

	return (
		<div className="flex flex-col flex-grow py-2 overflow-auto">
			{conversations.map((conversation, index) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					isLastIndex={index === conversations.length - 1}
				/>
			))}
		</div>
	);
}
