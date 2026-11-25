import {
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import RowActions from "../components/RowActions";

const hasNoItems = (items) =>
	!items?.length || items[0]?.toLowerCase() === "none";

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

export const dutiesColumns = [
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

export const soldiersColumns = [
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
		enableSorting: false,
	},
	{
		id: "rank.name",
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
