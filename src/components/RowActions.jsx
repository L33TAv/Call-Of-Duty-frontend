import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Stack,
	Tooltip,
} from "@mui/material";
import { useState } from "react";

const RowActions = ({ row, onEdit, onDelete, type }) => {
	const [isOpen, setIsOpen] = useState(false);
	const isDuty = type === "duty";
	const isScheduled = row.original?.status === "scheduled";

	return (
		<>
			<Stack direction="row" spacing={1}>
				<Tooltip
					title={isScheduled ? "Scheduled duties cannot be edited" : "Edit"}
				>
					<span>
						<IconButton
							size="small"
							onClick={() => onEdit(row)}
							disabled={isScheduled}
						>
							<EditIcon fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip
					title={isScheduled ? "Scheduled duties cannot be deleted" : "Delete"}
				>
					<span>
						<IconButton
							size="small"
							disabled={isScheduled}
							color="error"
							onClick={() => setIsOpen(true)}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
			</Stack>
			<Dialog
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
			>
				<DialogTitle sx={{ textAlign: "center" }}>
					Delete {isDuty ? "duty" : "soldier"}
				</DialogTitle>

				<DialogContent sx={{ textAlign: "center" }}>
					<DialogContentText>
						You are going to delete {isDuty ? "duty " : "soldier "}
						{row.original?._id}
					</DialogContentText>
				</DialogContent>

				<DialogActions sx={{ justifyContent: "center" }}>
					<Button onClick={() => setIsOpen(false)}>Cancel</Button>

					<Button
						onClick={() => {
							onDelete(row);
							setIsOpen(false);
						}}
						variant="contained"
						color="error"
						autoFocus
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default RowActions;
