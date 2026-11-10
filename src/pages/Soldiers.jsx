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
import { deleteSoldier, fetchSoldiers } from "../api/soldiers";
import AddSoldierButton from "../components/AddSoldierButton";
import { SoldierCard } from "../components/Card";
import SearchBar from "../components/SearchBar";

const PAGE_SIZE = 15;

export default function SoldiersPage() {
	const [selectedSoldier, setSelectedSoldier] = useState(null);
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
		queryKey: ["soldiers"],
		queryFn: ({ pageParam }) =>
			fetchSoldiers({ pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined;

			return allPages.length + 1;
		},
	});

	const [searchParams] = useSearchParams();

	const soldierQuery = searchParams.get("q") || "";

	const allSoldiers = data?.pages.flat() || [];
	const filteredSoldiers = allSoldiers.filter((soldier) =>
		soldier.name.toLowerCase().includes(soldierQuery.toLowerCase()),
	);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteSoldier,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["soldiers"] });

			setSelectedSoldier(null);

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
				<Alert severity="error">Failed to load soldiers: {error.message}</Alert>
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
				<SearchBar label="Search for a soldier" />
				<AddSoldierButton />
			</Box>
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
				{filteredSoldiers.map((soldier) => (
					<SoldierCard
						key={soldier._id}
						soldier={soldier}
						onSelect={setSelectedSoldier}
					/>
				))}
			</Box>
			{filteredSoldiers.length === 0 && !isLoading && (
				<Box sx={{ textAlign: "center", py: 6 }}>
					<Typography color="text.secondary">
						No soldiers found matching "{soldierQuery}"
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
				open={Boolean(selectedSoldier)}
				onClose={() => setSelectedSoldier(null)}
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
						<strong>Rank:</strong> {selectedSoldier?.rank?.name || "Unknown"}
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
						color="error"
						onClick={() => {
							onDelete(selectedSoldier._id);
						}}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? "Deleting..." : "Delete"}
					</Button>
					<Button onClick={() => setSelectedSoldier(null)}>Close</Button>
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
