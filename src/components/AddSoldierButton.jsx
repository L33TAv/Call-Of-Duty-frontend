import AddIcon from "@mui/icons-material/Add";
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Snackbar,
	Stack,
	TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {postSoldier} from '../api/soldiers'

const RANK_NAMES = {
	0: "private",
	1: "corporal",
	2: "sergeant",
	3: "lieutenant",
	4: "captain",
	5: "major",
	6: "colonel",
};

export default function AddSoldierButton() {
	const [open, setOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		setError,
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

			setShowSuccess(true);
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
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="xs"
				fullWidth
			>
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
									required: "First name is required",
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
								<MenuItem value={RANK_NAMES[0]}>{RANK_NAMES[0]}</MenuItem>
								<MenuItem value={RANK_NAMES[1]}>{RANK_NAMES[1]}</MenuItem>
								<MenuItem value={RANK_NAMES[2]}>{RANK_NAMES[2]}</MenuItem>
								<MenuItem value={RANK_NAMES[3]}>{RANK_NAMES[3]}</MenuItem>
								<MenuItem value={RANK_NAMES[4]}>{RANK_NAMES[4]}</MenuItem>
								<MenuItem value={RANK_NAMES[5]}>{RANK_NAMES[5]}</MenuItem>
								<MenuItem value={RANK_NAMES[6]}>{RANK_NAMES[6]}</MenuItem>
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

			<Snackbar
				open={showSuccess}
				autoHideDuration={2000}
				onClose={() => setShowSuccess(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setShowSuccess(false)}
					severity="success"
					variant="filled"
					sx={{ width: "100%" }}
				>
					Soldier added successfully!
				</Alert>
			</Snackbar>
		</>
	);
}
