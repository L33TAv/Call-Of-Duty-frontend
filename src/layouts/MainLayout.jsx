import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
	return (
		<Box>
			<NavBar />

			<Box component="main">
				<Outlet />
			</Box>
		</Box>
	);
}
