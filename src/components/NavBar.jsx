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
import { Link } from "react-router-dom";

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

					[theme.breakpoints.up("md")]: {
						minHeight: { xs: "40px", md: "60px" },
						display: "flex",
						justifyContent: "space-around",
					},
				})}
			>
				<Typography
					variant="h6"
					component="div"
					sx={{
						flexGrow: {
							xs: 1,
							md: 0,
						},
						fontWeight: "Bold",
						fontSize: 25,
					}}
				>
					Call of duty
				</Typography>

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

				<Box sx={{ display: { xs: "block", md: "none" } }}>
					<IconButton color="inherit" onClick={handleDrawerToggle}>
						<MenuIcon />
					</IconButton>
				</Box>

				<Drawer anchor="right" open={isOpen} onClose={handleDrawerToggle}>
					<Box onClick={handleDrawerToggle} sx={{ width: 200, pt: 2 }}>
						<List>
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
