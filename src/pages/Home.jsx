import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { Link } from "react-router";

const SECTIONS = [
	{
		title: "Soldiers",
		description: "Browse personnel, inspect ranks, and manage limitations.",
		actionLabel: "View soldiers",
		to: "/soldiers",
		icon: GroupsIcon,
		color: "primary.main",
	},
	{
		title: "Duties",
		description: "Create operations, set rank bounds, and track schedules.",
		actionLabel: "View duties",
		to: "/duties",
		icon: AssignmentIcon,
		color: "secondary.main",
	},
	{
		title: "Admin Console",
		description: "Sort records, inspect status history, and batch-manage data.",
		actionLabel: "Open console",
		to: "/admin",
		icon: AdminPanelSettingsIcon,
		color: "info.main",
	},
];

export default function HomePage() {
	return (
		<Container maxWidth="lg" sx={{ py: 2 }}>
			<Stack
				spacing={2.5}
				alignItems="center"
				textAlign="center"
				sx={{
					mb: { xs: 5, md: 7 },
					px: 2,
					py: { xs: 4, md: 6 },
					borderRadius: 4,
					border: 1,
					borderColor: "divider",
					background:
						"radial-gradient(circle at top, rgba(16, 185, 129, 0.14), rgba(17, 24, 39, 0.6) 65%)",
				}}
			>
				<Typography
					variant="h3"
					sx={{
						fontWeight: 700,
						fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
					}}
				>
					Call of Duty{" "}
					<Box component="span" sx={{ color: "primary.main" }}>
						Scheduler
					</Box>
				</Typography>

				<Typography color="text.secondary" sx={{ maxWidth: 560 }}>
					Manage soldiers, operational duties, and scheduling constraints from
					one central command hub.
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					sx={{ pt: 1 }}
				>
					<Button
						variant="contained"
						size="large"
						component={Link}
						to="/duties"
					>
						Browse Duties
					</Button>
					<Button
						variant="outlined"
						size="large"
						component={Link}
						to="/soldiers"
					>
						View Soldiers
					</Button>
				</Stack>
			</Stack>

			<Box
				sx={{
					display: "grid",
					gap: 3,
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
				}}
			>
				{SECTIONS.map(
					({ title, description, actionLabel, to, icon: Icon, color }) => (
						<Card
							key={to}
							variant="outlined"
							sx={{
								borderRadius: 3,
								borderColor: "divider",
								transition: "transform 0.2s ease, border-color 0.2s ease",
								"&:hover": {
									transform: "translateY(-4px)",
									borderColor: "primary.main",
								},
							}}
						>
							<CardActionArea
								component={Link}
								to={to}
								sx={{ height: "100%", p: 1 }}
							>
								<CardContent
									sx={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
										gap: 1.5,
									}}
								>
									<Icon sx={{ fontSize: 36, color }} />
									<Typography variant="h5" sx={{ fontWeight: 600 }}>
										{title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{description}
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										spacing={0.5}
										sx={{
											mt: "auto",
											pt: 1,
											color,
											fontWeight: 600,
											fontSize: "0.875rem",
										}}
									>
										<span>{actionLabel}</span>
										<ArrowForwardIcon fontSize="inherit" />
									</Stack>
								</CardContent>
							</CardActionArea>
						</Card>
					),
				)}
			</Box>
		</Container>
	);
}
