import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

export default function SoldierCard({ soldier }) {
  return (
    <Card
      variant="outlined"
      sx={{
        minHeight: 200,
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
      <CardContent
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <Typography variant="h4" sx={{ fontWeight: "medium" }}>
          {soldier.name}
        </Typography>
        <Typography>ID : {soldier._id || "unknown"}</Typography>
        <Typography>Rank : {soldier.rank?.name || "Unknown rank"}</Typography>
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 600, mb: 0.5 }}
          >
            Limitations:
          </Typography>
          {!soldier.limitations?.length ? (
            <Chip label="None" sx={{ fontSize: "0.75rem" }} size="small"></Chip>
          ) : (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {soldier.limitations.slice(0, 2).map((limit) => (
                <Chip
                  key={limit}
                  label={limit}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))}
              {soldier.limitations.length > 2 && (
                <Tooltip
                  title={soldier.limitations.slice(2).join(", ")}
                  arrow
                  enterTouchDelay={0}
                  leaveTouchDelay={1500}
                >
                  <Chip
                    clickable
                    label={`+${soldier.limitations.length - 2} more`}
                    size="small"
                    color="primary"
                    sx={{ fontSize: "0.75rem", cursor: "pointer" }}
                  />
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
