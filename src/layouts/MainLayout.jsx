import { Box } from "@mui/material";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function MainLayout() {
	return (
		<Box>
			<NavBar />
			<Box component="main" sx={{ p: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
}
