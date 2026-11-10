import {
	Alert,
	Box,
	CircularProgress,
	Container,
	Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { fetchDuties } from "../api/duties";
import AddDutiesButton from "../components/AddDutiesButton";
import { DutyCard } from "../components/Card";
import SearchBar from "../components/SearchBar";

const PAGE_SIZE = 15;

export default function DutiesPage() {
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

	const [searchParams] = useSearchParams();

	const dutyQuery = searchParams.get("q") || "";

	const allDuties = data?.pages.flat() || [];

	const filteredDuties = allDuties.filter((duty) =>
		duty.name.toLowerCase().includes(dutyQuery.toLowerCase()),
	);

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
					<DutyCard key={duty._id} duty={duty} />
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
		</Container>
	);
}
