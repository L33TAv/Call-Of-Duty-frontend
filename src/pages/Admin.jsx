import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ResourceTable } from "../components/Tables";

export default function AdminPage() {
	const [tab, setTab] = useState(0);

	return (
		<Box>
			<Tabs
				value={tab}
				onChange={(_, newValue) => setTab(newValue)}
				sx={{ mb: 2 }}
				centered
			>
				<Tab label="Soldiers" />
				<Tab label="Duties" />
			</Tabs>

			<Box
				sx={{
					width: "90%",
					maxWidth: 1400,
					mx: "auto",
					mt: 2,
					overflowX: "auto",
				}}
			>
				<ResourceTable key={tab} type={tab === 0 ? "soldier" : "duty"} />
			</Box>
		</Box>
	);
}
