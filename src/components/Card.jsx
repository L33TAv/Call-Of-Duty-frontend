import { Card, CardContent, Typography } from "@mui/material";

export default function SoldierCard({ soldier }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: 200,
        color: "text.secondary",
        borderRadius: 3,
        borderColor: "divider",
        transition: "all 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "primary.dark",
        },
      }}
    >
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: "medium" }}>
          {soldier.name}
        </Typography>
        <Typography>ID : {soldier._id || "unknown"}</Typography>
        <Typography>Rank : {soldier.rank?.name || "Unknown rank"}</Typography>
        <Typography
          noWrap
          sx={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Limitations : {soldier.limitations?.join(", ") || "None"}
        </Typography>
      </CardContent>
    </Card>
  );
}
