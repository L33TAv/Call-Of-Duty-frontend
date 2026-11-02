import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const theme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#0B0F19",
			paper: "#111827",
		},
		text: {
			primary: "#F1F5F9",
			secondary: "rgb(181, 192, 206)",
		},
		primary: {
			main: "#10B981",
			light: "#34D399",
			dark: "#059669",
		},
		secondary: {
			main: "#F59E0B",
		},
		divider: "rgba(255, 255, 255, 0.08)",
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 10,
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
