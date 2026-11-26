import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState } from "react";
import FeedbackSnackbar from "./FeedbackSnackbar";
import { SoldierFormDialog } from "./FormDialog";

const AddSoldierButton = () => {
	const [open, setOpen] = useState(false);
	const [showToast, setShowToast] = useState({ open: false });

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				variant="contained"
				color="secondary"
				size="small"
				startIcon={<AddIcon />}
				sx={{
					fontSize: "15px",
					px: 2.5,
					py: 1,
					mx: 2,
				}}
			>
				Add a soldier
			</Button>

			<SoldierFormDialog
				open={open}
				setShowToast={setShowToast}
				setOpen={setOpen}
			/>

			<FeedbackSnackbar showToast={showToast} handleShowToast={setShowToast} />
		</>
	);
};

export default AddSoldierButton;
