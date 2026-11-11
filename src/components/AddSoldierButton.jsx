import AddIcon from "@mui/icons-material/Add";
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Stack,
	TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { postSoldier } from "../api/soldiers";
import FeedbackSnackbar from "./FeedbackSnackbar";

const RANK_NAMES = [
	"private",
	"corporal",
	"sergeant",
	"lieutenant",
	"captain",
	"major",
	"colonel",
];

export default function AddSoldierButton() {
	const [open, setOpen] = useState(false);
	const [showToast, setShowToast] = useState({ open: false });
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: { _id: "", name: "", rankName: "", limitations: "" },
	});

	const addMutation = useMutation({
		mutationFn: postSoldier,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["soldiers"] });

			setOpen(false);

			reset();

			setShowToast({
				open: true,
				message: "Soldier added successfully!",
				severity: "success",
			});
		},

		onError: (error) => {
			if (error.message === "Resource already exists") {
				setError("_id", {
					type: "server",
					message: "This ID is already registered in the system.",
				});
			} else if (error.message === "Validation error has occurred") {
				setError("root", {
					type: "server",
					message: "There was a validation error. Please try again later.",
				});
			} else {
				setError("root", {
					type: "server",
					message: "Something went wrong. Please try again later.",
				});
			}
		},
	});

	const onSubmit = (data) => {
		addMutation.mutate(data);
	};

	const handleClose = () => {
		clearErrors();
		reset();
		setOpen(false);
	};

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
			<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
				<DialogTitle>Add a New Soldier</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent>
						<Stack spacing={3}>
							{errors.root && (
								<Alert severity="error">{errors.root.message}</Alert>
							)}

							<TextField
								label="Name"
								fullWidth
								{...register("name", {
									required: "Name is required",
									minLength: {
										value: 3,
										message: "Must be at least 3 characters",
									},
									maxLength: {
										value: 50,
										message: "Must be shorter than 50 characters",
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							></TextField>

							<TextField
								{...register("rankName", {
									required: "Rank is required",
								})}
								select
								defaultValue=""
								label="Rank"
								error={!!errors.rankName}
								helperText={errors.rankName?.message}
							>
								<MenuItem value="" disabled>
									Select a rank
								</MenuItem>
								{RANK_NAMES.map((rank) => {
									return (
										<MenuItem key={rank} value={rank}>
											{rank}
										</MenuItem>
									);
								})}
							</TextField>

							<TextField
								label="Id"
								fullWidth
								{...register("_id", {
									required: "Id is required",
									validate: (value) => {
										if (!/^\d+$/.test(value)) {
											return "The ID must contain only numbers.";
										}

										if (value.length !== 7) {
											return "The ID must be exactly 7 digits long.";
										}

										return true;
									},
								})}
								error={!!errors._id}
								helperText={errors._id?.message}
							></TextField>

							<TextField
								label="Limitations"
								fullWidth
								{...register("limitations", {
									setValueAs: (value) => {
										if (!value || value.trim() === "") {
											return undefined;
										}

										const parsedLimitation = value
											.split(",")
											.map((item) => item.trim())
											.filter((item) => item !== "");

										return parsedLimitation.length > 0
											? parsedLimitation
											: undefined;
									},
								})}
							></TextField>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={addMutation.isPending}
						>
							{addMutation.isPending ? "Creating..." : "Submit"}
						</Button>
						<Button onClick={handleClose} color="inherit">
							Cancel
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			<FeedbackSnackbar showToast={showToast} handleShowToast={setShowToast} />
		</>
	);
}
