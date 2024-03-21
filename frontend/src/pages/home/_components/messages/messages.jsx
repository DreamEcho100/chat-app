import { useEffect, useRef } from "react";
import useQueryManager from "../../../../libs/utils/hooks/query-manager";
import useUserConversations from "../../../../libs/utils/zustand/user-conversations";
import Message from "./message";
import MessageSkeleton from "../../../../components/core/skeletons/message";

export default function Messages() {
	const { messages, setMessages, selectedConversation } = useUserConversations();
	const lastMessageRef = useRef(/** @type {null | HTMLDivElement} */ (null));

	const { query } = useQueryManager({
		queryKey: "messages",
		/** @param {{ input: {conversationId: string;} }} props */
		input: { conversationId: selectedConversation?._id ?? "" },
		queryFn: async (input) => {
			if (!input.conversationId) {
				throw new Error("No conversation selected");
			}
			return await fetch(`/api/messages/${input.conversationId}`);
		},
		/** @param {import("../../../../libs/utils/types").Message[]} data */
		onSuccess: (data) => {
			setMessages(data);
		},
		stopDefault: { successHandling: true },
	});

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [query.data]);

	return (
		<div className="flex-1 px-4 overflow-auto">
			{!query.isLoading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			{query.isLoading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!query.isLoading && messages?.length === 0 && (
				<p className="text-center">Send a message to start the conversation</p>
			)}
		</div>
	);
}
