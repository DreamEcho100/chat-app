import { useAuthContext } from "../../../../libs/utils/contexts/auth";
import useUserConversations from "../../../../libs/utils/zustand/user-conversation";

/** @param {string} dateString */
export function extractTime(dateString) {
	const date = new Date(dateString);
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

/** @param {number} num */
// Helper function to pad single-digit numbers with a leading zero
function padZero(num) {
	return num.toString().padStart(2, "0");
}

/** @param {{ message: import("../../../../libs/utils/types").Message; }} props  */
export default function Message(props) {
	const { user: authUser } = useAuthContext();
	const { selectedConversation } = useUserConversations();
	const fromMe = props.message.senderId === authUser?._id;
	const formattedTime = extractTime(props.message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser?.profilePicture : selectedConversation?.profilePicture;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = props.message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Tailwind CSS chat bubble component" src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{props.message.content}</div>
			<div className="flex items-center gap-1 text-xs opacity-50 chat-footer">{formattedTime}</div>
		</div>
	);
}
