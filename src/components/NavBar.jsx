import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Box,
	Button,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";

export default function NavBar() {
	const [isOpen, setOpen] = useState(false);

	function handleDrawerToggle() {
		setOpen(!isOpen);
	}

	return (
		<AppBar position="sticky" color="primary" elevation={2}>
			<Toolbar
				sx={(theme) => ({
					minHeight: "40px",
					display: "flex",
					justifyContent: "space-between",

					[theme.breakpoints.up("md")]: {
						minHeight: { xs: "40px", md: "60px" },
					},
				})}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 1,
					}}
				>
					<GpsFixedIcon sx={{ display: { xs: "none", md: "block" } }} />
					<Typography
						variant="h6"
						component="div"
						noWrap
						sx={{
							flexGrow: {
								xs: 1,
								md: 0,
							},
							fontWeight: "Bold",
							fontSize: {
								xs: 17,
								sm: 20,
								md: 25,
							},
						}}
					>
						Call of duty
					</Typography>
				</Box>

				<Box sx={{ display: "flex", flexDirection: "row" }}>
					<Box sx={{ display: { xs: "none", md: "block" } }}>
						<Button color="inherit" component={Link} to="/">
							Home
						</Button>
						<Button color="inherit" component={Link} to="/soldiers">
							Soldiers
						</Button>
						<Button color="inherit" component={Link} to="/duties">
							Duties
						</Button>
						<Button color="inherit" component={Link} to="/admin">
							Admin
						</Button>
					</Box>
				</Box>

				<Box sx={{ display: { xs: "block", md: "none" } }}>
					<IconButton color="inherit" onClick={handleDrawerToggle}>
						<MenuIcon />
					</IconButton>
				</Box>
				<Drawer anchor="right" open={isOpen} onClose={handleDrawerToggle}>
					<Box sx={{ width: 200, pt: 2 }}>
						<List onClick={handleDrawerToggle}>
							<ListItem disablePadding>
								<ListItemButton component={Link} to="/">
									<ListItemText primary="Home" />
								</ListItemButton>
							</ListItem>

							<ListItem disablePadding>
								<ListItemButton component={Link} to="/soldiers">
									<ListItemText primary="Soldiers" />
								</ListItemButton>
							</ListItem>

							<ListItem disablePadding>
								<ListItemButton component={Link} to="/duties">
									<ListItemText primary="Duties" />
								</ListItemButton>
							</ListItem>

							<ListItem disablePadding>
								<ListItemButton component={Link} to="/admin">
									<ListItemText primary="Admin" />
								</ListItemButton>
							</ListItem>
						</List>
					</Box>
				</Drawer>
			</Toolbar>
		</AppBar>
	);
}
