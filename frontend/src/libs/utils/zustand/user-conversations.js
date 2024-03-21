import { create } from "zustand";

/**
 * @template Type
 * @typedef {Type | ((prev: Type) => Type)} ValueOrUpdater
 */

/**
 * @typedef {{
 *  selectedConversation: import("../types").Conversation | null;
 *  setSelectedConversation: (selectedConversation: import("../types").Conversation | null) => void;
 *  messages: import("../types").Message[];
 *  setMessages: (valueOrUpdater: ValueOrUpdater<import("../types").Message[]>) => void;
 * }} UserConversationShape
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<UserConversationShape>>} */
const useUserConversations = create(
	(set, get) =>
		/** @type {UserConversationShape} */ ({
			selectedConversation: null,
			setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
			messages: [],
			setMessages: (valueOrUpdater) =>
				set({
					messages: typeof valueOrUpdater === "function" ? valueOrUpdater(get().messages) : valueOrUpdater,
				}),
		}),
);

export default useUserConversations;
