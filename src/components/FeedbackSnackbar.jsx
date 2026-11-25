import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Snackbar } from "@mui/material";

export default function FeedbackSnackbar({ handleShowToast, showToast }) {
	return (
		<Snackbar
			open={showToast.open}
			autoHideDuration={2000}
			onClose={() => handleShowToast({ ...showToast, open: false })}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
			<Alert
				onClose={() => handleShowToast({ ...showToast, open: false })}
				severity={showToast?.severity || "info"}
				variant="filled"
				icon={
					showToast?.isDelete ? <DeleteIcon fontSize="inherit" /> : undefined
				}
				sx={{ width: "100%" }}
			>
				{showToast?.message}
			</Alert>
		</Snackbar>
	);
}
