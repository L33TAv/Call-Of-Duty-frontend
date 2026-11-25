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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { patchSoldier, postSoldier } from "../api/soldiers";

const RANK_NAMES = [
	"private",
	"corporal",
	"sergeant",
	"lieutenant",
	"captain",
	"major",
	"colonel",
];

const EMPTY_SOLDIER_VALUES = {
	_id: "",
	name: "",
	rankName: "",
	limitations: "",
};

export function SoldierFormDialog({
	open,
	soldier,
	setShowToast,
	setSoldier,
	setOpen,
}) {
	const isEdit = Boolean(soldier?._id);

	const {
		register,
		handleSubmit,
		reset,
		setError,
		watch,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: EMPTY_SOLDIER_VALUES,
	});

	const queryClient = useQueryClient();

	const addMutation = useMutation({
		mutationFn: (data) =>
			isEdit
				? patchSoldier({ soldierId: soldier._id, newSoldier: data })
				: postSoldier(data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["soldiers"] });

			if (isEdit && setSoldier) {
				setSoldier({ ...soldier, open: false });
			}

			setOpen(false);

			reset();

			setShowToast({
				open: true,
				message: isEdit
					? "Soldier updated successfully!"
					: "Soldier added successfully!",
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

	useEffect(() => {
		if (!open) return;
		if (isEdit) {
			reset({
				name: soldier.name ?? "",
				rankName: soldier.rank?.name ?? "",
				limitations: soldier.limitations?.join(", ") ?? "",
			});
		} else {
			reset(EMPTY_SOLDIER_VALUES);
		}
	}, [open, isEdit, soldier, reset]);

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>{isEdit ? "Edit Soldier" : "Add a New Soldier"}</DialogTitle>
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
							value={watch("rankName") ?? ""}
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

						{!isEdit && (
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
						)}

						<TextField
							label="Limitations"
							fullWidth
							{...register("limitations", {
								setValueAs: (value) => {
									if (!value || value.trim() === "") {
										return isEdit ? [] : undefined;
									}

									const parsedLimitation = value
										.split(",")
										.map((item) => item.trim().toLowerCase())
										.filter((item) => item !== "");

									const uniqueItems = [...new Set(parsedLimitation)];
									return uniqueItems.length > 0
										? uniqueItems
										: isEdit
											? []
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
						{addMutation.isPending
							? isEdit
								? "Saving..."
								: "Creating..."
							: "Submit"}
					</Button>
					<Button onClick={handleClose} color="inherit">
						Cancel
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
