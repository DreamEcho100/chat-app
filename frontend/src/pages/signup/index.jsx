import { z } from "zod";
import Link from "../../components/common/ui/link";
import toast from "react-hot-toast";
import { useAuthContext } from "../../libs/utils/contexts/auth";
import useFormManager from "../../libs/utils/hooks/form-manager";

const signUpSchema = z
	.object({
		fullName: z.string().min(3).max(120),
		username: z.string().min(3).max(120),
		password: z.string().min(8).max(120),
		confirmPassword: z.string().min(8).max(120),
		gender: z.enum(["male", "female"]).default("male"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password and confirm password do not match",
		params: {
			statusCode: 400,
		},
		path: ["confirmPassword"],
	});

function useSignUpForm() {
	const authContext = useAuthContext();
	const { isLoading, handleOnSubmit } = useFormManager({
		schema: signUpSchema,
		mutationFn: (input) => {
			return fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
		},
		onSuccess: (data) => {
			authContext.setUser(data);
			toast.success("Account created successfully", { icon: "🚀" });
		},
		resetFormOnSuccess: true,
		stopDefault: { successHandling: true },
	});

	return { onSubmit: handleOnSubmit, isLoading };
}

export default function SignUpPage() {
	const { onSubmit, isLoading } = useSignUpForm();

	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
				<h1 className="text-3xl font-semibold text-center text-gray-300">
					Sign Up <span className="text-blue-500"> ChatApp</span>
				</h1>

				<form onSubmit={onSubmit}>
					<div>
						<label className="label p-2">
							<span className="text-base label-text">Full Name</span>
						</label>
						<input
							name="fullName"
							placeholder="John Doe"
							className="w-full input input-bordered  h-10"
							required
							minLength={3}
							maxLength={120}
						/>
					</div>

					<div>
						<label className="label p-2 ">
							<span className="text-base label-text">Username</span>
						</label>
						<input
							name="username"
							placeholder="johndoe"
							className="w-full input input-bordered h-10"
							required
							minLength={3}
							maxLength={120}
						/>
					</div>

					<div>
						<label className="label">
							<span className="text-base label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="Enter Password"
							className="w-full input input-bordered h-10"
							required
							minLength={8}
							maxLength={120}
						/>
					</div>

					<div>
						<label className="label">
							<span className="text-base label-text">Confirm Password</span>
						</label>
						<input
							name="confirmPassword"
							type="password"
							placeholder="Confirm Password"
							className="w-full input input-bordered h-10"
							required
							minLength={8}
							maxLength={120}
						/>
					</div>

					<div className="flex">
						<div className="form-control">
							<label className={`label gap-2 cursor-pointer`}>
								<span className="label-text">Male</span>
								<input type="radio" name="gender" className="radio border-slate-900" value="male" defaultChecked />
							</label>
						</div>
						<div className="form-control">
							<label className={`label gap-2 cursor-pointer`}>
								<span className="label-text">Female</span>
								<input type="radio" name="gender" className="radio border-slate-900" value="female" />
							</label>
						</div>
					</div>

					<Link href="/login" className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
						Already have an account?
					</Link>

					<div>
						<button
							type="submit"
							className="btn btn-block btn-sm mt-2 border border-slate-700 capitalize"
							disabled={isLoading}
						>
							{isLoading ? <span className="loading loading-spinner" /> : "sign up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
