import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner({ size = 40, py = 8 }) {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", py }}>
			<CircularProgress color="primary" size={size} />
		</Box>
	);
}
