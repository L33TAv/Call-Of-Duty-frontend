import AddIcon from "@mui/icons-material/Add";
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { postDuty } from "../api/duties";
import FeedbackSnackbar from "./FeedbackSnackbar";

export default function AddDutiesButton() {
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
		defaultValues: {
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
		},
	});

	const addMutation = useMutation({
		mutationFn: postDuty,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["duties"] });

			setOpen(false);

			reset();

			setShowToast({
				open: true,
				message: "Duty added successfully!",
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
				Add a duty
			</Button>
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

			<FeedbackSnackbar showToast={showToast} handleShowToast={setShowToast} />
		</>
	);
}
