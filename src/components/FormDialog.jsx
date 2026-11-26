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
import { patchDuty, postDuty } from "../api/duties";
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

const EMPTY_DUTY_VALUES = {
	name: "",
	description: "",
	location: {
		type: "Point",
		coordinates: "",
	},
	constraints: "",
	startTime: "",
	endTime: "",
	soldiersRequired: "",
	value: "",
	minRank: "",
	maxRank: "",
};

const toDateTimeLocal = (isoString) => {
	if (!isoString) return "";
	const date = new Date(isoString);
	const offsetMs = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const SoldierFormDialog = ({
	open,
	soldier,
	setShowToast,
	setSoldier,
	setOpen,
}) => {
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
										.map((item) => item.trim())
										.filter((item) => item !== "");

									return parsedLimitation.length > 0
										? parsedLimitation
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
						{addMutation.isPending ? "Creating..." : "Submit"}
					</Button>
					<Button onClick={handleClose} color="inherit">
						Cancel
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

const DutyFormDialog = ({ open, duty, setShowToast, setDuty, setOpen }) => {
	const queryClient = useQueryClient();

	const isEdit = Boolean(duty?._id);

	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: EMPTY_DUTY_VALUES,
	});

	const addMutation = useMutation({
		mutationFn: (data) =>
			isEdit ? patchDuty({ dutyId: duty._id, newDuty: data }) : postDuty(data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["duties"] });

			if (isEdit && setDuty) {
				setDuty({ ...duty, open: false });
			}

			setOpen(false);

			reset();

			setShowToast({
				open: true,
				message: isEdit
					? "Duty updated successfully!"
					: "Duty added successfully!",
				severity: "success",
			});
		},

		onError: (error) => {
			setError("root", {
				type: "server",
				message:
					error.message || "Something went wrong. Please try again later.",
			});
		},
	});

	const onSubmit = (data) => {
		const formattedData = {
			...data,
			startTime: data.startTime
				? new Date(data.startTime).toISOString()
				: undefined,
			endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
		};

		const payload = Object.fromEntries(
			Object.entries(formattedData).filter(
				([_, value]) => value !== "" && value !== undefined && value !== null,
			),
		);

		addMutation.mutate(payload);
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
				name: duty.name ?? "",
				description: duty.description ?? "",
				location: {
					type: "Point",
					coordinates: duty.location?.coordinates?.join(", ") ?? "",
				},
				constraints: duty.constraints?.join(", ") ?? "",
				startTime: toDateTimeLocal(duty.startTime) || "",
				endTime: toDateTimeLocal(duty.endTime) || "",
				soldiersRequired: duty.soldiersRequired ?? "",
				value: duty.value ?? "",
				minRank: duty.minRank ?? "",
				maxRank: duty.maxRank ?? "",
			});
		} else {
			reset(EMPTY_DUTY_VALUES);
		}
	}, [open, isEdit, duty, reset]);

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>Add a New Duty</DialogTitle>
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
							label="Description"
							fullWidth
							multiline
							rows={4}
							{...register("description", {
								required: "Description is required",
								maxLength: {
									value: 100,
									message: "Must be shorter than 100 characters",
								},
							})}
							error={!!errors.description}
							helperText={errors.description?.message}
						></TextField>

						<TextField
							label="Coordinates"
							fullWidth
							{...register("location.coordinates", {
								required: "Coordinates are required",
								setValueAs: (value) => {
									if (!value || value.trim() === "") {
										return undefined;
									}

									const parsedCoordinates = value
										.split(",")
										.map((item) => item.trim())
										.filter((item) => item !== "")
										.map(Number);

									return parsedCoordinates.length > 0
										? parsedCoordinates
										: undefined;
								},
								validate: (value) => {
									if (!Array.isArray(value) || value.some(Number.isNaN)) {
										return "Coordinates must be valid numbers.";
									}

									if (value.length !== 3 && value.length !== 2) {
										return "The coordinates must contains 2-3 points.";
									}

									const [lon, lat] = value;

									if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
										return "Invalid coordinates: Longitude (-180 to 180), Latitude (-90 to 90).";
									}

									return true;
								},
							})}
							error={!!errors.location?.coordinates}
							helperText={errors.location?.coordinates?.message}
						></TextField>

						<TextField
							label="Value"
							fullWidth
							type="number"
							slotProps={{
								htmlInput: {
									min: 1,
									step: 1,
								},
							}}
							{...register("value", {
								required: "value is required",
								setValueAs: (value) =>
									value === "" || value === null ? undefined : Number(value),
								validate: (value) => {
									if (value < 1) {
										return "value must be positive.";
									}

									return true;
								},
							})}
							error={!!errors.value}
							helperText={errors.value?.message}
						></TextField>

						<TextField
							label="Constraints"
							fullWidth
							{...register("constraints", {
								required: "Constraints are required.",
								setValueAs: (value) => {
									if (!value || value.trim() === "") {
										return undefined;
									}

									const parsedConstraints = value
										.split(",")
										.map((item) => item.trim())
										.filter((item) => item !== "");

									const uniqueItems = [...new Set(parsedConstraints)];
									return uniqueItems.length > 0 ? uniqueItems : undefined;
								},
							})}
							error={!!errors.constraints}
							helperText={errors.constraints?.message}
						></TextField>

						<TextField
							label="Soldiers required"
							fullWidth
							type="number"
							slotProps={{
								htmlInput: {
									min: 1,
									step: 1,
								},
							}}
							{...register("soldiersRequired", {
								required: "soldiers required is a required property",
								setValueAs: (value) =>
									value === "" || value === null ? undefined : Number(value),
								validate: (value) => {
									if (value < 1) {
										return "soldiers required must be positive.";
									}

									return true;
								},
							})}
							error={!!errors.soldiersRequired}
							helperText={errors.soldiersRequired?.message}
						></TextField>

						<TextField
							label="Start Time"
							type="datetime-local"
							fullWidth
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							{...register("startTime", {
								required: "Start time is a required property",
								validate: (value) => {
									const selectedTime = new Date(value);
									const now = new Date();
									if (selectedTime <= now) {
										return "Start time must be in the future";
									}

									return true;
								},
							})}
							error={!!errors.startTime}
							helperText={errors.startTime?.message}
						></TextField>

						<TextField
							label="End Time"
							type="datetime-local"
							fullWidth
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							{...register("endTime", {
								required: "End time is a required property",
								validate: (value, formValues) => {
									const selectedTime = new Date(value);
									const now = new Date();
									if (selectedTime <= now) {
										return "End time must be in the future";
									}

									if (
										formValues.startTime &&
										selectedTime <= new Date(formValues.startTime)
									) {
										return "End time must be after start time";
									}
									return true;
								},
							})}
							error={!!errors.endTime}
							helperText={errors.endTime?.message}
						></TextField>

						<TextField
							label="Minimum rank"
							fullWidth
							type="number"
							slotProps={{
								htmlInput: {
									min: 1,
									max: 6,
									step: 1,
								},
							}}
							{...register("minRank", {
								setValueAs: (value) =>
									value === "" || value === null ? undefined : Number(value),
								validate: (value) => {
									if (value < 0 || value > 6) {
										return "value must be between 1 to 6.";
									}

									return true;
								},
							})}
							error={!!errors.minRank}
							helperText={errors.minRank?.message}
						></TextField>

						<TextField
							label="Maximum rank"
							fullWidth
							type="number"
							slotProps={{
								htmlInput: {
									min: 1,
									max: 6,
									step: 1,
								},
							}}
							{...register("maxRank", {
								setValueAs: (value) =>
									value === "" || value === null ? undefined : Number(value),
								validate: (value, formValues) => {
									if (value < 0 || value > 6) {
										return "value must be between 1 to 6.";
									}

									if (value < formValues.minRank) {
										return "maximum rank must be bigger than minimum rank.";
									}

									return true;
								},
							})}
							error={!!errors.maxRank}
							helperText={errors.maxRank?.message}
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
	);
};

export { DutyFormDialog, SoldierFormDialog };
