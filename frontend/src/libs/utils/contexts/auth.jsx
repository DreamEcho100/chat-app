import { createContext, useContext, useState } from "react";

/**
 * @typedef {{
 *  _id: string;
 *  username: string,
 *  fullName: string,
 *  profilePicture: string,
 *  gender: "male" | "female",
 *  createdAt: Date,
 *  updatedAt: Date,
 *  __v: any,
 * }} AuthUser
 *
 * @typedef {{
 * 	user: AuthUser | null | undefined;
 * 	setUser: import("react").Dispatch<React.SetStateAction<AuthUser | null | undefined>>;
 * 	isLoading: boolean;
 * 	setIsLoading: import("react").Dispatch<React.SetStateAction<boolean>>
 * }} AuthContextState
 */

export const AuthContext =
	/** @type {import("react").Context<AuthContextState>} */
	(/** @type {unknown} */ (createContext([null, () => {}])));

export function useAuthContext() {
	return useContext(AuthContext);
}

export function useGetAuthedUserFromContext() {
	const user = useContext(AuthContext).user;

	if (!user) {
		throw new Error("User not found in context");
	}

	return user;
}

/** @param {import("react").PropsWithChildren} props  */
export function AuthContextProvider(props) {
	const [user, setUser] = useState(/** @type {AuthUser | null | undefined} */ (null));

	const [isLoading, setIsLoading] = useState(true);

	return (
		<AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>{props.children}</AuthContext.Provider>
	);
}
