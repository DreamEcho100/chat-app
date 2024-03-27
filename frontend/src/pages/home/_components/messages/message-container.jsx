import { useEffect } from "react";
import useUserConversations from "../../../../libs/utils/zustand/user-conversation";
import MessageInput from "./message-input";
import Messages from "./messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../../../libs/utils/contexts/auth";

function NoChatSelected() {
	const { user: authUser } = useAuthContext();

	if (!authUser) {
		return <p className="text-center text-gray-200">Loading...</p>;
	}

	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="flex flex-col items-center gap-2 px-4 font-semibold text-center text-gray-200 sm:text-lg md:text-xl">
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="text-3xl text-center md:text-6xl" />
			</div>
		</div>
	);
}

export default function MessageContainer() {
	const { selectedConversation, setSelectedConversation } = useUserConversations();

	useEffect(() => {
		return () => {
			setSelectedConversation(null);
		};
	}, [setSelectedConversation]);

	return (
		<div className="md:min-w-[450px] flex flex-col">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className="px-4 py-2 mb-2 bg-slate-500">
						<span className="label-text">To:</span>{" "}
						<span className="font-bold text-gray-900">{selectedConversation.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
}
