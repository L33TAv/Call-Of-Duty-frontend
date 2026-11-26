import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
			<CircularProgress color="primary" />
		</Box>
	);
};

export default LoadingSpinner;
