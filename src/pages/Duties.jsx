import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { deleteDuty, fetchDuties } from "../api/duties";
import AddDutiesButton from "../components/AddDutiesButton";
import { DutyCard } from "../components/Card";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const PAGE_SIZE = 15;

export default function DutiesPage() {
	const [selectedDuty, setSelectedDuty] = useState({ open: false });
	const [showToast, setShowToast] = useState({ open: false });
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["duties"],
		queryFn: ({ pageParam }) => fetchDuties({ pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined;

			return allPages.length + 1;
		},
	});

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteDuty,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["duties"] });

			setSelectedDuty({ open: false });

			setShowToast({
				open: true,
				message: "Duty deleted successfully!",
				severity: "success",
				isDelete: true,
			});
		},

		onError: (error) => {
			setShowToast({
				open: true,
				message: error.message || "Failed to delete duty. Please try again.",
				severity: "error",
			});
		},
	});

	const [searchParams] = useSearchParams();

	const dutyQuery = searchParams.get("q") || "";

	const allDuties = data?.pages.flat() || [];

	const filteredDuties = allDuties.filter((duty) =>
		duty.name.toLowerCase().includes(dutyQuery.toLowerCase()),
	);

	const onDelete = (dutyId) => {
		deleteMutation.mutate(dutyId);
	};

	const loadMoreRef = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

	if (isLoading) return <LoadingSpinner />;

	if (isError)
		return (
			<Container sx={{ py: 4 }}>
				<Alert severity="error">Failed to load duties: {error.message}</Alert>
			</Container>
		);

	return (
		<Container sx={{ py: 2 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: {
						xs: "column",
						sm: "row",
					},
					gap: 2,
					mb: 3,
				}}
			>
				<SearchBar label="Search for a duty" />
				<AddDutiesButton />
			</Box>
			<Box
				sx={{
					gap: 2,
					display: "grid",
					gridTemplateColumns: {
						xs: "repeat(1, 1fr)",
						sm: "repeat(2, 1fr)",
						md: "repeat(3, 1fr)",
						lg: "repeat(4, 1fr)",
					},
				}}
			>
				{filteredDuties.map((duty) => (
					<DutyCard key={duty._id} duty={duty} onSelect={setSelectedDuty} />
				))}
			</Box>
			{filteredDuties.length === 0 && !isLoading && (
				<Box sx={{ textAlign: "center", py: 6 }}>
					<Typography color="text.secondary">
						{dutyQuery
							? `No duties found matching ${dutyQuery}`
							: "No duties found."}
					</Typography>
				</Box>
			)}
			<div ref={loadMoreRef} style={{ height: "20px", visibility: "hidden" }} />
			{isFetchingNextPage && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
					<CircularProgress size={28} color="primary" />
				</Box>
			)}

			<Dialog
				open={Boolean(selectedDuty.open)}
				onClose={() => setSelectedDuty({ ...selectedDuty, open: false })}
				fullWidth
				sx={{
					"& .MuiDialog-paper": {
						maxWidth: {
							xs: "95%",
							sm: "500px",
							md: "700px",
						},
					},
				}}
			>
				<DialogTitle>{selectedDuty?.name}</DialogTitle>
				<DialogContent dividers>
					<Typography variant="body2" sx={{ mb: 1 }}>
						<strong>ID:</strong> {selectedDuty?._id}
					</Typography>
					<Typography variant="body2" sx={{ mb: 1 }}>
						<strong>Description:</strong> {selectedDuty?.description || "None"}
					</Typography>
					<Typography variant="body2" sx={{ mb: 1 }}>
						<strong>Coordinates: </strong>
						{selectedDuty?.location?.coordinates?.join(", ") || "Unknown"}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Constraints:</strong>{" "}
						{selectedDuty?.constraints?.join(", ") || "None"}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Start Time:</strong>{" "}
						{new Date(selectedDuty?.startTime).toLocaleString() || "Unknown"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>End Time:</strong>{" "}
						{new Date(selectedDuty?.endTime).toLocaleString() || "Unknown"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Soldiers Required:</strong>{" "}
						{selectedDuty?.soldiersRequired || "Unknown"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Value:</strong> {selectedDuty?.value || "Unknown"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Soldiers:</strong>
						{selectedDuty?.soldiers?.length > 0
							? selectedDuty?.soldiers.join(", ")
							: " None assigned"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Minimum Rank:</strong>{" "}
						{selectedDuty?.minRank || " Not assigned"}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Maximum Rank:</strong>{" "}
						{selectedDuty?.maxRank || " Not assigned"}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						color="error"
						onClick={() => {
							onDelete(selectedDuty._id);
						}}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? "Deleting..." : "Delete"}
					</Button>
					<Button
						onClick={() => setSelectedDuty({ ...selectedDuty, open: false })}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<FeedbackSnackbar showToast={showToast} handleShowToast={setShowToast} />
		</Container>
	);
}
