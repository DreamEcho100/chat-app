import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./libs/utils/contexts/auth.jsx";

const rootElem = document.getElementById("root");

if (!rootElem) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElem).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</BrowserRouter>
	</React.StrictMode>,
);
