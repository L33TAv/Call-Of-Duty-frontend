import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import SoldierCard from "../components/Card";
import { useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";

const PAGE_SIZE = 15;

const fetchSoldiers = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `/soldiers?page=${pageParam}&limit=${PAGE_SIZE}`,
  );

  if (!response.ok) throw new Error("Network response was not ok");

  return response.json();
};

export default function SoldiersPage() {
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
    queryFn: fetchSoldiers,
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
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <SearchBar />
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
          <SoldierCard key={soldier._id} soldier={soldier} />
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
    </Container>
  );
}
