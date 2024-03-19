import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./libs/utils/contexts/auth";
import { useEffect } from "react";

function App() {
	const { user: authUser, setUser: setAuthUser, isLoading, setIsLoading } = useAuthContext();

	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/auth/me");

				if (!response.ok || response.status >= 400) {
					const data = await response.json();
					throw new Error(data.message);
				}

				const data = await response.json();
				setAuthUser(data);
			} catch (error) {
				console.error(error);
			}

			setIsLoading(false);
		})();
	}, [setAuthUser, setIsLoading]);

	return (
		<div className="p-4 h-screen flex items-center justify-center">
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Routes>
					<Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
					<Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
				</Routes>
			)}

			<Toaster />
		</div>
	);
}

export default App;
