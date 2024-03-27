import { BsSend } from "react-icons/bs";

import toast from "react-hot-toast";
import { z } from "zod";
import useUserConversations from "../../../../libs/utils/zustand/user-conversation";
import useFormManager from "../../../../libs/utils/hooks/form-manager";
import { useId } from "react";

const sendMessageSchema = z.object({
	content: z.string().min(1),
});

export default function MessageInput() {
	const { setMessages, selectedConversation } = useUserConversations();

	const reactId = useId();
	const formId = `content-form-${reactId}`;
	const mainSubmitButtonId = `submit-button-${reactId}`;

	const { handleOnSubmit, isLoading } = useFormManager({
		schema: sendMessageSchema,
		mutationFn: async (input) => {
			if (!selectedConversation?._id) {
				throw new Error("No conversation selected");
			}

			return await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: input.content }),
			});
		},
		/** @param {import('../../../../libs/utils/types').Message} data */
		onSuccess: (data) => {
			setMessages((prev) => [...prev, data]);
			toast.success("Message sent", { icon: "🚀" });
		},
		stopDefault: { successHandling: true },
		resetFormOnSuccess: true,
	});

	if (!selectedConversation?._id) {
		return <div className="text-center text-gray-200">Select a conversation to send a message</div>;
	}

	return (
		<form className="px-4 my-3" onSubmit={handleOnSubmit} id={formId}>
			<div className="relative w-full">
				<textarea
					name="content"
					required
					minLength={1}
					className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
					placeholder="Send a message"
					onKeyDown={(event) => {
						if (!event.shiftKey && event.key === "Enter") {
							event.preventDefault();
							/** @type {HTMLButtonElement | null} */ (document.getElementById(mainSubmitButtonId))?.click();
						}
					}}
				/>
				<button type="submit" className="absolute inset-y-0 flex items-center end-0 pe-3" id={mainSubmitButtonId}>
					{isLoading ? <span className="loading loading-spinner" /> : <BsSend />}
				</button>
			</div>
		</form>
	);
}
