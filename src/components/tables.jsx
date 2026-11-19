import {
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { tableFeatures, useTable } from "@tanstack/react-table";
import { useState } from "react";

const LabelByChips = ({ info }) => {
	const limits = info.getValue() ?? [];

	if (!limits.length || limits[0]?.toLowerCase() === "none") {
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
				label={info.getValue().length}
				onClick={() => {
					setOpen(true);
				}}
			></Chip>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>History of {info.row.getValue("_id")}</DialogTitle>

				<DialogContent>
					<Stack spacing={1}>
						{info.getValue()?.map((history, index) => (
							<Typography key={history.date}>
								{index + 1}: {history.status} {history.date}
							</Typography>
						))}
					</Stack>
				</DialogContent>
			</Dialog>
		</>
	);
}

const duties = [];

const soldiers = [];

const soldiersColumns = [
	{
		accessorKey: "_id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "limitations",
		header: "Limitations",
		cell: (info) => <LabelByChips info={info} />,
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

const features = tableFeatures({});

function DataTable({ columns, data }) {
	const table = useTable({ features, columns, data });
	return (
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
						{headerGroup.headers.map((header) => (
							<TableCell key={header.id} sx={{ whiteSpace: "nowrap" }}>
								{header.isPlaceholder ? null : (
									<table.FlexRender header={header} />
								)}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableHead>

			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow hover key={row.id}>
						{row.getAllCells().map((cell) => (
							<TableCell key={cell.id}>
								<table.FlexRender cell={cell} />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export function DutiesTable() {
	return <DataTable data={duties} columns={dutiesColumns} />;
}

export function SoldiersTable() {
	return <DataTable data={soldiers} columns={soldiersColumns} />;
}
