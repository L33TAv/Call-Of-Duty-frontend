import {
	Chip,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import { tableFeatures, useTable } from "@tanstack/react-table";

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

const duties = [
	{
		_id: "6a967f43e528d9fc45f6a7fa",
		name: "avatar",
		description: "a",
		location: {
			type: "Point",
			coordinates: [30, 10],
		},
		constraints: [],
		startTime: "2027-11-01T07:12:00.000Z",
		endTime: "2028-10-01T07:12:00.000Z",
		soldiersRequired: 5,
		value: 5,
		soldiers: [],
		status: "scheduled",
		statusHistory: ["unscheduled", "2026-09-01T07:31:15.504Z"],
	},
	{
		_id: "6a967f47e528d9fc45f6a7fc",
		name: "avatar",
		description: "a",
		location: {
			type: "Point",
			coordinates: [30, 10],
		},
		constraints: [],
		startTime: "2027-11-01T07:12:00.000Z",
		endTime: "2028-10-01T07:12:00.000Z",
		soldiersRequired: 5,
		value: 5,
		soldiers: [],
		status: "unscheduled",
		statusHistory: ["unscheduled", "2026-09-01T07:31:19.859Z"],
	},
	{
		_id: "6af327359f2ebba25239b083",
		name: "Cool duty",
		description: "really!",
		location: {
			type: "Point",
			coordinates: [-10, 25],
		},
		startTime: "2026-11-11T00:00:00.000Z",
		endTime: "2026-11-13T00:00:00.000Z",
		constraints: ["none"],
		soldiersRequired: 1,
		value: 1,
		soldiers: [],
		status: "unscheduled",
		statusHistory: [
			{
				status: "unscheduled",
				date: "2026-11-10T14:16:21.317Z",
			},
		],
		createdAt: "2026-11-10T14:16:21.317Z",
		updatedAt: "2026-11-10T14:16:21.317Z",
	},
	{
		_id: "6af460a99da01ae4dff8370e",
		name: "adsda",
		description: "Nah",
		location: {
			type: "Point",
			coordinates: [-10, 25],
		},
		startTime: "2026-11-12T12:33:00.000Z",
		endTime: "2026-11-27T12:33:00.000Z",
		constraints: ["ad"],
		soldiersRequired: 3,
		value: 4111,
		minRank: 1,
		maxRank: 3,
		soldiers: [],
		status: "unscheduled",
		statusHistory: [
			{
				status: "unscheduled",
				date: "2026-11-11T12:33:45.951Z",
			},
		],
		createdAt: "2026-11-11T12:33:45.951Z",
		updatedAt: "2026-11-11T12:33:45.951Z",
	},
	{
		_id: "6af461ba9da01ae4dff8370f",
		name: "asd",
		description: "adas",
		location: {
			type: "Point",
			coordinates: [-10, 25],
		},
		startTime: "2026-11-26T12:38:00.000Z",
		endTime: "2026-12-10T12:38:00.000Z",
		constraints: ["adsa"],
		soldiersRequired: 1,
		value: 2,
		minRank: 1,
		maxRank: 2,
		soldiers: [],
		status: "unscheduled",
		statusHistory: [
			{
				status: "unscheduled",
				date: "2026-11-11T12:38:18.439Z",
			},
		],
		createdAt: "2026-11-11T12:38:18.439Z",
		updatedAt: "2026-11-11T12:38:18.439Z",
	},
	{
		_id: "6af461ec9da01ae4dff83710",
		name: "asd",
		description: "adas",
		location: {
			type: "Point",
			coordinates: [-10, 22],
		},
		startTime: "2026-11-20T12:41:00.000Z",
		endTime: "2026-11-28T12:39:00.000Z",
		constraints: ["asds"],
		soldiersRequired: 2,
		value: 1,
		minRank: 2,
		maxRank: 4,
		soldiers: [],
		status: "unscheduled",
		statusHistory: [
			{
				status: "unscheduled",
				date: "2026-11-11T12:39:08.633Z",
			},
		],
		createdAt: "2026-11-11T12:39:08.633Z",
		updatedAt: "2026-11-11T12:39:08.633Z",
	},
];

const soldiers = [
	{
		_id: "1232168",
		name: "shmuel",
		limitations: [],
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-09-12T12:41:03.976Z",
		updatedAt: "2026-09-12T12:41:03.976Z",
	},
	{
		_id: "1232568",
		name: "shmuel",
		limitations: ["food", "haganash", "avtash"],
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-09-16T17:15:43.785Z",
		updatedAt: "2026-09-16T17:15:43.785Z",
	},
	{
		_id: "1234538",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-09-18T17:40:20.740Z",
		updatedAt: "2026-09-18T17:40:20.740Z",
	},
	{
		_id: "1234328",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:28.596Z",
		updatedAt: "2026-10-31T12:16:28.596Z",
	},
	{
		_id: "1214328",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:32.196Z",
		updatedAt: "2026-10-31T12:16:32.196Z",
	},
	{
		_id: "1214828",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:34.933Z",
		updatedAt: "2026-10-31T12:16:34.933Z",
	},
	{
		_id: "1214928",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:37.850Z",
		updatedAt: "2026-10-31T12:16:37.850Z",
	},
	{
		_id: "2214928",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:40.326Z",
		updatedAt: "2026-10-31T12:16:40.326Z",
	},
	{
		_id: "2214929",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:43.658Z",
		updatedAt: "2026-10-31T12:16:43.658Z",
	},
	{
		_id: "2114929",
		name: "sam",
		rank: {
			name: "corporal",
			value: 1,
		},
		createdAt: "2026-10-31T12:16:53.463Z",
		updatedAt: "2026-10-31T12:16:53.463Z",
	},
];

const dutiesColumns = [
	{
		accessorKey: "_id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Soldier Name",
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
		cell: (info) => new Date(info.getValue()).toLocaleString(),
	},
	{
		accessorKey: "endTime",
		header: "End Time",
		cell: (info) => new Date(info.getValue()).toLocaleString(),
	},
	{
		accessorKey: "constraints",
		header: "Constraints",
		cell: (info) => <LabelByChips info={info} />,
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
		cell: (info) => info.getValue()?.length ?? 0,
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
