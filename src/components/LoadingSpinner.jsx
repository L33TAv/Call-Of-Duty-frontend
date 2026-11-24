import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
	return (
		<Box sx={{ display: "flex", justifyContent: "center" }}>
			<CircularProgress color="primary" />
		</Box>
	);
};

export default LoadingSpinner;
