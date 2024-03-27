import { useMemo } from "react";
import { getRandomEmoji } from "../../../../libs/utils/get-random-Emoji";
import useUserConversations from "../../../../libs/utils/zustand/user-conversation";
import { useSocketContext } from "../../../../libs/utils/contexts/socket";

/**
 * @param {{
 * 	conversation: import("../../../../libs/utils/types").Conversation;
 *  isLastIndex: boolean;
 *  emoji?: string;
 * }} props
 */
export default function Conversation(props) {
	const { selectedConversation, setSelectedConversation } = useUserConversations();
	const emoji = useMemo(() => props.emoji ?? getRandomEmoji(), [props.emoji]);

	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(props.conversation._id);

	const isSelected = selectedConversation?._id === props.conversation._id;

	return (
		<>
			<div
				className={`flex items-center gap-2 p-2 py-1 rounded cursor-pointer hover:bg-sky-600 ${
					isSelected ? "bg-sky-500" : ""
				}`}
				onClick={() => {
					setSelectedConversation(props.conversation);
				}}
			>
				<div className={`avatar ${isOnline ? "online" : "offline"}`}>
					<div className="w-12 rounded-full">
						<img src={props.conversation.profilePicture} alt="user avatar" />
					</div>
				</div>

				<div className="flex flex-col flex-1">
					<div className="flex justify-between gap-3">
						<p className="font-bold text-gray-200">{props.conversation.fullName}</p>
						<span className="text-xl">{emoji}</span>
					</div>
				</div>
			</div>

			{!props.isLastIndex && <div className="h-1 py-0 my-0 divider" />}
		</>
	);
}
