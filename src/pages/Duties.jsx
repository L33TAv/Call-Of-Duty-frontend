import DeleteIcon from "@mui/icons-material/Delete";
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
	Snackbar,
	Typography,
} from "@mui/material";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { deleteDuty, fetchDuties } from "../api/duties";
import AddDutiesButton from "../components/AddDutiesButton";
import { DutyCard } from "../components/Card";
import SearchBar from "../components/SearchBar";

const PAGE_SIZE = 15;

export default function DutiesPage() {
	const [selectedDuty, setSelectedDuty] = useState(null);
	const [showToast, setShowToast] = useState({ open: false });
	const loadMoreRef = useRef(null);
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

			setSelectedDuty(null);

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
				message: error.message || "Failed to delete soldier. Please try again.",
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

	const onDelete = (soldierId) => {
		deleteMutation.mutate(soldierId);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.5, rootMargin: "200px" },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading)
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
				<CircularProgress aria-label="Loading…" color="primary" />
			</Box>
		);

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
				<SearchBar />
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
					<Typography color="text.secondary">No duties found.</Typography>
				</Box>
			)}
			<div ref={loadMoreRef} style={{ height: "20px", visibility: "hidden" }} />
			{isFetchingNextPage && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
					<CircularProgress size={28} color="primary" />
				</Box>
			)}

			<Dialog
				open={Boolean(selectedDuty)}
				onClose={() => setSelectedDuty(null)}
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
						{new Date(selectedDuty?.startTime).toLocaleDateString()}
					</Typography>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>End Time:</strong>{" "}
						{new Date(selectedDuty?.endTime).toLocaleDateString()}
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
						{selectedDuty?.soldiers.length > 0
							? selectedDuty?.soldiers
							: " Unknown"}
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
					<Button onClick={() => setSelectedDuty(null)}>Close</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={showToast.open}
				autoHideDuration={2000}
				onClose={() => setShowToast({ ...showToast, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setShowToast({ ...showToast, open: false })}
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
		</Container>
	);
}
