import { useMemo } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useUserConversations from "../../../../libs/utils/zustand/user-conversations";
import toast from "react-hot-toast";
import useQueryManager from "../../../../libs/utils/hooks/query-manager";
import { z } from "zod";

const sendMessageSchema = z.object({
	search: z.string().min(3),
});

export default function SearchInput() {
	const { setSelectedConversation } = useUserConversations();

	const { query } = useQueryManager({
		queryKey: "conversations",
		// input: props.input,
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

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();

				const formData = new FormData(/** @type {HTMLFormElement} */ (event.target));
				const search = formData.get("search")?.toString() ?? "";

				const result = sendMessageSchema.safeParse({ search });

				if (!result.success) {
					return toast.error("Search term must be at least 3 characters long");
				}

				const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

				if (conversation) {
					setSelectedConversation(conversation);
					/** @type {HTMLFormElement} */ (event.target).reset();
				} else {
					toast.error("No such user found!");
				}
			}}
			className="flex items-center gap-2"
		>
			<input name="search" placeholder="Search…" className="rounded-full input input-bordered" />
			<button type="submit" className="text-white btn btn-circle bg-sky-500">
				<IoSearchSharp className="w-6 h-6 outline-none" />
			</button>
		</form>
	);
}
