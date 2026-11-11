import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { useSearchParams } from "react-router";

export default function SearchBar({ label }) {
	const [Param, setParam] = useSearchParams();

	return (
		<TextField
			id={label}
			label={label}
			variant="outlined"
			size="small"
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" sx={{ color: "#9e9e9e" }} />
						</InputAdornment>
					),
				},
			}}
			sx={{ width: { xs: 180, sm: 220, md: 250 } }}
			value={Param.get("q") || ""}
			onChange={(e) => {
				const next = new URLSearchParams(Param);
				const text = e.target.value;
				if (text) next.set("q", text);
				else next.delete("q");
				setParam(next, { replace: true });
			}}
		/>
	);
}
