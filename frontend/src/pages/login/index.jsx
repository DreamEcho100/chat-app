import { z } from "zod";
import Link from "../../components/common/ui/link";
import { useAuthContext } from "../../libs/utils/contexts/auth";
import useFormManager from "../../libs/utils/hooks/form-manager";
import toast from "react-hot-toast";

const signUpSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(8),
});

function useLoginForm() {
	const authContext = useAuthContext();

	const { isLoading, handleOnSubmit } = useFormManager({
		schema: signUpSchema,
		mutationFn: (input) => {
			return fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
		},
		onSuccess: (data) => {
			authContext.setUser(data);
			toast.success("Logged in successfully", { icon: "🚀" });
		},
		resetFormOnSuccess: true,
		stopDefault: { successHandling: true },
	});

	return { onSubmit: handleOnSubmit, isLoading };
}

export default function LoginPage() {
	const { onSubmit, isLoading } = useLoginForm();

	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
				<h1 className="text-3xl font-semibold text-center text-gray-300">
					Login
					<span className="text-blue-500"> ChatApp</span>
				</h1>

				<form onSubmit={onSubmit}>
					<div>
						<label className="label p-2">
							<span className="text-base label-text">Username</span>
						</label>
						<input
							name="username"
							required
							minLength={3}
							placeholder="Enter username"
							className="w-full input input-bordered h-10"
						/>
					</div>

					<div>
						<label className="label">
							<span className="text-base label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							required
							minLength={8}
							placeholder="Enter Password"
							className="w-full input input-bordered h-10"
						/>
					</div>
					<Link href="/signup" className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block">
						{"Don't"} have an account?
					</Link>

					<div>
						<button className="btn btn-block btn-sm mt-2 capitalize">
							{isLoading ? <span className="loading loading-spinner" /> : "login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
