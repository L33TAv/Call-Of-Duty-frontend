import {
	Alert,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createSortedRowModel,
	rowSortingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { deleteDuty, fetchDuties } from "../api/duties";
import { deleteSoldier, fetchSoldiers } from "../api/soldiers";
import { DutyFormDialog } from "../features/DutyFormDialog";
import { SoldierFormDialog } from "../features/SoldierFormDialog";
import { dutiesColumns, soldiersColumns } from "../features/TableColumns";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import FeedbackSnackbar from "./FeedbackSnackbar";
import LoadingSpinner from "./LoadingSpinner";

const PAGE_SIZE = 15;

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
});

function DataTable({ columns, data = [], meta }) {
	const table = useTable({ features, columns, data, meta });

	return (
		<Paper variant="outlined">
			<TableContainer>
				<Table sx={{ width: "100%" }}>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								sx={{
									fontWeight: 700,
									color: "text.secondary",
									fontSize: "0.75rem",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
								}}
							>
								{headerGroup.headers.map((header) => {
									const sorted = header.column.getIsSorted();

									return (
										<TableCell key={header.id} sx={{ whiteSpace: "nowrap" }}>
											{header.isPlaceholder ? null : (
												<TableSortLabel
													active={!!sorted}
													direction={sorted || "asc"}
													onClick={header.column.getToggleSortingHandler()}
													disabled={!header.column.getCanSort()}
												>
													<table.FlexRender header={header} />
												</TableSortLabel>
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>

					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									align="center"
									sx={{ py: 4 }}
								>
									<Typography color="text.secondary">No data found.</Typography>
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow hover key={row.id}>
									{row.getAllCells().map((cell) => (
										<TableCell key={cell.id}>
											<table.FlexRender cell={cell} />
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

export function ResourceTable({ type }) {
	const queryClient = useQueryClient();
	const isSoldierTable = type === "soldier";
	const resourceKey = isSoldierTable ? "soldiers" : "duties";

	const [editingTask, setEditingTask] = useState({ open: false });
	const [editOpen, setEditOpen] = useState(false);
	const [showToast, setShowToast] = useState({ open: false });

	const {
		data,
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: [resourceKey, "table"],
		queryFn: ({ pageParam }) => {
			if (isSoldierTable) {
				return fetchSoldiers({ pageParam, pageSize: PAGE_SIZE });
			}

			return fetchDuties({ pageParam, pageSize: PAGE_SIZE });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined;

			return allPages.length + 1;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: isSoldierTable ? deleteSoldier : deleteDuty,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [resourceKey],
			});

			setEditingTask({ open: false });

			setShowToast({
				open: true,
				message: `${type} deleted successfully!`,
				severity: "success",
				isDelete: true,
			});
		},

		onError: (error) => {
			setShowToast({
				open: true,
				message: error.message || `Failed to delete ${type}. Please try again.`,
				severity: "error",
			});
		},
	});

	const loadMoreRef = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

	const flattenedData = useMemo(() => data?.pages?.flat() ?? [], [data]);

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<Alert severity="error">
				Failed to load {resourceKey}: {error.message}
			</Alert>
		);

	return (
		<>
			<DataTable
				data={flattenedData}
				columns={isSoldierTable ? soldiersColumns : dutiesColumns}
				meta={{
					onEdit: (row) => {
						setEditingTask(row.original);
						setEditOpen(true);
					},
					onDelete: (row) => deleteMutation.mutate(row.original._id),
				}}
			/>

			{isFetchingNextPage && <LoadingSpinner />}

			<div ref={loadMoreRef} style={{ height: "20px", visibility: "hidden" }} />

			{isSoldierTable ? (
				<SoldierFormDialog
					open={editOpen}
					soldier={editingTask}
					setShowToast={setShowToast}
					setSoldier={setEditingTask}
					setOpen={setEditOpen}
				/>
			) : (
				<DutyFormDialog
					open={editOpen}
					duty={editingTask}
					setShowToast={setShowToast}
					setDuty={setEditingTask}
					setOpen={setEditOpen}
				/>
			)}

			<FeedbackSnackbar handleShowToast={setShowToast} showToast={showToast} />
		</>
	);
}
