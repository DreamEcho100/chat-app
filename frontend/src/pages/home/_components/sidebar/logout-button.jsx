import { BiLogOut } from "react-icons/bi";

import { useAuthContext } from "../../../../libs/utils/contexts/auth";
import useFormManager from "../../../../libs/utils/hooks/form-manager";
import toast from "react-hot-toast";

function useLogout() {
	const { setUser: setAuthUser } = useAuthContext();

	const { isLoading, handleOnSubmit } = useFormManager({
		mutationFn: () => {
			return fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
		},
		onSuccess: () => {
			setAuthUser(null);
			toast.success("Logged out successfully", { icon: "🚀" });
		},
		stopDefault: { successHandling: true },
	});

	return { isLoading, onSubmit: handleOnSubmit };
}

export default function LogoutButton() {
	const { isLoading, onSubmit } = useLogout();

	return (
		<form onSubmit={onSubmit}>
			<button type="submit" className="mt-auto btn btn-outline w-fit" disabled={isLoading}>
				{!isLoading ? (
					<BiLogOut className="w-6 h-6 text-white cursor-pointer" />
				) : (
					<span className="loading loading-spinner" />
				)}
			</button>
		</form>
	);
}
