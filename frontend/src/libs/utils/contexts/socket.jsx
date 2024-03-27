import { createContext, useState, useEffect, useContext } from "react";
// import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { useAuthContext } from "./auth";

/**
 * @typedef {{
 * 	socket: null | import("socket.io-client").Socket;
 * 	onlineUsers: string[];
 * }} SocketContextValue
 */

const SocketContext = createContext(/** @type {SocketContextValue} */ ({ socket: null, onlineUsers: [] }));

export function useSocketContext() {
	return useContext(SocketContext);
}

/** @param {import("react").PropsWithChildren} props */
export function SocketContextProvider(props) {
	const [socket, setSocket] = useState(/** @type {SocketContextValue["socket"]} */ (null));
	const [onlineUsers, setOnlineUsers] = useState(/** @type {SocketContextValue["onlineUsers"]} */ ([]));
	const { user: authUser, isLoading } = useAuthContext();

	useEffect(() => {
		if (isLoading) return;

		if (authUser) {
			const socket = io("http://localhost:5000", {
				query: { userId: authUser._id },
			});

			setSocket(socket);

			console.log("get-online-users");
			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on(
				"get-online-users",
				/** @param {SocketContextValue["onlineUsers"]} users */
				(users) => {
					setOnlineUsers(users);
				},
			);

			return () => {
				socket.close();
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, isLoading]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{props.children}</SocketContext.Provider>;
}
