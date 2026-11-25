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
import { deleteSoldier, fetchSoldiers } from "../api/soldiers";
import { SoldierCard } from "../components/Card";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import AddSoldierButton from "../features/AddSoldierButton";
import { SoldierFormDialog } from "../features/SoldierFormDialog";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const PAGE_SIZE = 15;

export default function SoldiersPage() {
	const [selectedSoldier, setSelectedSoldier] = useState({ open: false });
	const [showToast, setShowToast] = useState({ open: false });
	const [open, setOpen] = useState(false);

	const [searchParams] = useSearchParams();

	const soldierQuery = searchParams.get("q") || "";

	const debouncedQuery = useDebounce(soldierQuery, 300);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isFetching,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["soldiers", debouncedQuery.trim()],
		queryFn: ({ pageParam }) =>
			fetchSoldiers({ pageParam, pageSize: PAGE_SIZE, name: debouncedQuery }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined;

			return allPages.length + 1;
		},
	});

	const soldiersData = data?.pages.flat() || [];

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteSoldier,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["soldiers"] });

			setSelectedSoldier({ ...selectedSoldier, open: false });

			setShowToast({
				open: true,
				message: "Soldier deleted successfully!",
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

	const onDelete = (soldierId) => {
		deleteMutation.mutate(soldierId);
	};

	const loadMoreRef = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

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
				<SearchBar label="Search for a soldier" />
				<AddSoldierButton />
			</Box>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<Alert severity="error">Failed to load soldiers: {error.message}</Alert>
			) : (
				<>
					<Box
						sx={{
							gap: 2,
							display: "grid",
							gridTemplateColumns: {
								xs: "repeat(1, 1fr)",
								sm: "repeat(2, 1fr)",
								md: "repeat(3, 1fr)",
								lg: "repeat(5, 1fr)",
							},
						}}
					>
						{soldiersData.map((soldier) => (
							<SoldierCard
								key={soldier._id}
								soldier={soldier}
								onSelect={setSelectedSoldier}
							/>
						))}
					</Box>
					{soldiersData.length === 0 &&
						!isLoading &&
						!isFetching &&
						soldierQuery === debouncedQuery && (
							<Box sx={{ textAlign: "center", py: 6 }}>
								<Typography color="text.secondary">
									{debouncedQuery
										? `No soldiers found matching ${debouncedQuery.trim()}`
										: "No soldiers found."}
								</Typography>
							</Box>
						)}
					<div
						ref={loadMoreRef}
						style={{ height: "20px", visibility: "hidden" }}
					/>
					{isFetchingNextPage && (
						<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
							<CircularProgress size={28} color="primary" />
						</Box>
					)}
					<Dialog
						open={Boolean(selectedSoldier.open)}
						onClose={() =>
							setSelectedSoldier({ ...selectedSoldier, open: false })
						}
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
						<DialogTitle>{selectedSoldier?.name}</DialogTitle>
						<DialogContent dividers>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>ID:</strong> {selectedSoldier?._id}
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>Rank:</strong>{" "}
								{selectedSoldier?.rank?.name || "Unknown"}
							</Typography>
							<Typography variant="body2">
								<strong>Limitations:</strong>
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{selectedSoldier?.limitations?.join(", ") || "None"}
							</Typography>
						</DialogContent>
						<DialogActions>
							<Button
								color="info"
								onClick={() => {
									setOpen(true);
								}}
								disabled={open}
							>
								Edit
							</Button>
							<Button
								color="error"
								onClick={() => {
									onDelete(selectedSoldier._id);
								}}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</Button>
							<Button
								onClick={() =>
									setSelectedSoldier({ ...selectedSoldier, open: false })
								}
							>
								Close
							</Button>
						</DialogActions>
					</Dialog>
					<SoldierFormDialog
						open={open}
						setOpen={setOpen}
						soldier={selectedSoldier}
						setSoldier={setSelectedSoldier}
						setShowToast={setShowToast}
					/>
				</>
			)}
			<FeedbackSnackbar showToast={showToast} handleShowToast={setShowToast} />
		</Container>
	);
}
