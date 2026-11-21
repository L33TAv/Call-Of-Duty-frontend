import {
	Alert,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
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
import FeedbackSnackbar from "./FeedbackSnackbar";
import { DutyFormDialog, SoldierFormDialog } from "./FormDialog";
import LoadingSpinner from "./LoadingSpinner";
import RowActions from "./RowActions";

const hasNoItems = (items) =>
	!items?.length || items[0]?.toLowerCase() === "none";

const getItemCount = (items) => (hasNoItems(items) ? 0 : items.length);

const sortByItemCount = (rowA, rowB, columnId) =>
	getItemCount(rowA.getValue(columnId)) - getItemCount(rowB.getValue(columnId));

const LabelByChips = ({ info }) => {
	const limits = info.getValue() ?? [];

	if (hasNoItems(limits)) {
		return <Chip label="None" sx={{ fontSize: "0.75rem" }} size="small" />;
	}

	return (
		<Stack
			direction="row"
			spacing={0.5}
			useFlexGap
			sx={{
				justifyContent: { xs: "center", lg: "flex-start" },
				flexWrap: "wrap",
			}}
		>
			{limits.slice(0, 2).map((limit) => (
				<Chip
					key={limit}
					label={limit}
					size="small"
					variant="outlined"
					sx={{ fontSize: "0.75rem" }}
				/>
			))}

			{limits.length > 2 && (
				<Tooltip
					title={limits.slice(2).join(", ")}
					arrow
					enterTouchDelay={0}
					leaveTouchDelay={1500}
				>
					<Chip
						clickable
						label={`+${limits.length - 2} more`}
						size="small"
						color="primary"
						sx={{ fontSize: "0.75rem", cursor: "pointer" }}
					/>
				</Tooltip>
			)}
		</Stack>
	);
};

function ShowHistory({ info }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Chip
				clickable
				label={info.getValue()?.length}
				onClick={() => {
					setOpen(true);
				}}
				disabled={!info.getValue()?.length}
			></Chip>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>History of {info.row.getValue("_id")}</DialogTitle>

				<DialogContent>
					<Stack spacing={1}>
						{info.getValue()?.map((history, index) => (
							<Typography key={history.date}>
								{index + 1}: {history.status}{" "}
								{new Date(history.date).toLocaleString()}
							</Typography>
						))}
					</Stack>
				</DialogContent>
			</Dialog>
		</>
	);
}

const dutiesColumns = [
	{
		id: "actions",
		header: "Actions",
		enableSorting: false,
		cell: ({ row, table }) => (
			<RowActions
				row={row}
				onEdit={table.options.meta.onEdit}
				onDelete={table.options.meta.onDelete}
				type="duty"
			/>
		),
	},
	{
		accessorKey: "_id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Duty Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "location.type",
		header: "Location Type",
	},
	{
		accessorKey: "location.coordinates",
		header: "Coordinates",
		cell: (info) => info.getValue()?.join(", "),
	},
	{
		accessorKey: "startTime",
		header: "Start Time",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "Unknown",
	},
	{
		accessorKey: "endTime",
		header: "End Time",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "Unknown",
	},
	{
		accessorKey: "constraints",
		header: "Constraints",
		cell: (info) => <LabelByChips info={info} />,
		sortingFn: sortByItemCount,
	},
	{
		accessorKey: "soldiersRequired",
		header: "Soldiers Required",
	},
	{
		accessorKey: "value",
		header: "Value",
	},
	{
		accessorKey: "minRank",
		header: "Minimum Rank",
		cell: (info) => info.getValue() ?? "-",
	},
	{
		accessorKey: "maxRank",
		header: "Maximum Rank",
		cell: (info) => info.getValue() ?? "-",
	},
	{
		accessorKey: "soldiers",
		header: "Soldiers",
		cell: (info) => info.getValue()?.length ?? 0,
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "statusHistory",
		header: "Status History",
		cell: (info) => {
			return <ShowHistory info={info} />;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "-",
	},
	{
		accessorKey: "updatedAt",
		header: "Updated At",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "-",
	},
];

const soldiersColumns = [
	{
		id: "actions",
		header: "Actions",
		enableSorting: false,
		cell: ({ row, table }) => (
			<RowActions
				row={row}
				onEdit={table.options.meta.onEdit}
				onDelete={table.options.meta.onDelete}
				type="soldier"
			/>
		),
	},
	{
		accessorKey: "_id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		id: "limitations",
		accessorFn: (row) => row.limitations ?? [],
		header: "Limitations",
		cell: (info) => <LabelByChips info={info} />,
		sortingFn: sortByItemCount,
	},
	{
		accessorKey: "rank.name",
		header: "Rank name",
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "-",
	},
	{
		accessorKey: "updatedAt",
		header: "Updated At",
		cell: (info) =>
			info.getValue() ? new Date(info.getValue()).toLocaleString() : "-",
	},
];

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),

	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
});

function DataTable({ columns, data = [], meta }) {
	const table = useTable({ features, columns, data, meta });

	return (
		<>
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
							<TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
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
			<TablePagination
				component="div"
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
		</>
	);
}

export function DutiesTable() {
	const queryClient = useQueryClient();

	const [editingDuty, setEditingDuty] = useState({ open: false });
	const [editOpen, setEditOpen] = useState(false);
	const [showToast, setShowToast] = useState({ open: false });

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["duties", "table"],
		queryFn: () => fetchDuties({ pageParam: 1, pageSize: 100 }),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteDuty,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["duties"] });

			setEditingDuty({ open: false });

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

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<Alert severity="error">Failed to load duties: {error.message}</Alert>
		);

	return (
		<>
			<DataTable
				data={data}
				columns={dutiesColumns}
				meta={{
					onEdit: (row) => {
						setEditingDuty(row.original);
						setEditOpen(true);
					},
					onDelete: (row) => deleteMutation.mutate(row.original._id),
				}}
			/>

			<DutyFormDialog
				open={editOpen}
				duty={editingDuty}
				setShowToast={setShowToast}
				setDuty={setEditingDuty}
				setOpen={setEditOpen}
			/>

			<FeedbackSnackbar handleShowToast={setShowToast} showToast={showToast} />
		</>
	);
}

export function SoldiersTable() {
	const queryClient = useQueryClient();

	const [editingSoldier, setEditingSoldier] = useState({ open: false });
	const [editOpen, setEditOpen] = useState(false);
	const [showToast, setShowToast] = useState({ open: false });

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["soldiers", "table"],
		queryFn: () => fetchSoldiers({ pageParam: 1, pageSize: 100 }),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteSoldier,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["soldiers"] });

			setEditingSoldier({ open: false });

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

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<Alert severity="error">Failed to load soldiers: {error.message}</Alert>
		);

	return (
		<>
			<DataTable
				data={data}
				columns={soldiersColumns}
				meta={{
					onEdit: (row) => {
						setEditingSoldier(row.original);
						setEditOpen(true);
					},
					onDelete: (row) => deleteMutation.mutate(row.original._id),
				}}
			/>

			<SoldierFormDialog
				open={editOpen}
				soldier={editingSoldier}
				setShowToast={setShowToast}
				setSoldier={setEditingSoldier}
				setOpen={setEditOpen}
			/>

			<FeedbackSnackbar handleShowToast={setShowToast} showToast={showToast} />
		</>
	);
}
