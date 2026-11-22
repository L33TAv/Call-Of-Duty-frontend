import {
	Alert,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPaginatedRowModel,
	createSortedRowModel,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { deleteDuty, fetchDuties } from "../api/duties";
import { deleteSoldier, fetchSoldiers } from "../api/soldiers";
import { DutyFormDialog } from "../features/DutyFormDialog";
import { SoldierFormDialog } from "../features/SoldierFormDialog";
import { dutiesColumns, soldiersColumns } from "../features/TableColumns";
import FeedbackSnackbar from "./FeedbackSnackbar";
import LoadingSpinner from "./LoadingSpinner";

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),

	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
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
			<TablePagination
				component="div"
				sx={{
					borderTop: 1,
					borderColor: "divider",
					"& .MuiTablePagination-spacer": { display: "none" },
					"& .MuiTablePagination-toolbar": { justifyContent: "center" },
				}}
				count={table.getRowCount()}
				page={table.state.pagination.pageIndex}
				rowsPerPage={table.state.pagination.pageSize}
				onPageChange={(_, newPage) => {
					table.setPageIndex(newPage);
				}}
				onRowsPerPageChange={(event) => {
					table.setPageSize(Number(event.target.value));
				}}
				rowsPerPageOptions={[5, 10, 25, 50]}
			/>
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

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [resourceKey, "table"],
		queryFn: () => {
			if (isSoldierTable) {
				return fetchSoldiers({ pageParam: 1, pageSize: 100 });
			}

			return fetchDuties({ pageParam: 1, pageSize: 100 });
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
				data={data}
				columns={isSoldierTable ? soldiersColumns : dutiesColumns}
				meta={{
					onEdit: (row) => {
						setEditingTask(row.original);
						setEditOpen(true);
					},
					onDelete: (row) => deleteMutation.mutate(row.original._id),
				}}
			/>

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
