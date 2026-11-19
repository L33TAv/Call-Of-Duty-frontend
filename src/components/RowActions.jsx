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

export default function RowActions({
	row,
	onEdit,
	onDelete,
	type,
	setShowToast,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const isDuty = type === "duty";

	return (
		<>
			<Stack direction="row" spacing={1}>
				<Tooltip title="Edit">
					<IconButton size="small" onClick={() => onEdit(row)}>
						<EditIcon fontSize="small" />
					</IconButton>
				</Tooltip>

				<Tooltip title="Delete">
					<IconButton
						size="small"
						disabled={row.original?.status === "scheduled"}
						color="error"
						onClick={() => {
							setIsOpen(true);
						}}
					>
						<DeleteIcon fontSize="small" />
					</IconButton>
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
						you are going to delete {isDuty ? "duty " : "soldier "}
						{row.original?._id}
					</DialogContentText>
				</DialogContent>

				<DialogActions sx={{ justifyContent: "center" }}>
					<Button onClick={() => setIsOpen(false)}>Cancel</Button>

					<Button
						onClick={() => {
							onDelete(row);
							setIsOpen(false);
							setShowToast(true);
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
}
