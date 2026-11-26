import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Chip,
	Divider,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import OlMap from "ol/Map.js";
import "ol/ol.css";
import Overlay from "ol/Overlay.js";
import { fromLonLat } from "ol/proj.js";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import { useEffect, useRef, useState } from "react";
import { fetchAllDuties } from "../api/duties";

const DutiesMap = () => {
	const mapElementRef = useRef(null);
	const mapRef = useRef(null);
	const locationsSourceRef = useRef(null);

	const popupRef = useRef(null);
	const [selectedFeature, setSelectedFeature] = useState(null);
	console.log(selectedFeature);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["duties", "locations"],
		queryFn: fetchAllDuties,
	});

	useEffect(() => {
		const locationsSource = new VectorSource();

		const locationsLayer = new VectorLayer({
			source: locationsSource,
			style: {
				"circle-radius": 8,
				"circle-fill-color": [
					"case",
					["==", ["get", "status"], "scheduled"],
					"#10B981",
					"#EF4444",
				],
				"circle-stroke-color": "white",
				"circle-stroke-width": 2,
			},
		});

		const map = new OlMap({
			target: mapElementRef.current,
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
				locationsLayer,
			],
			view: new View({
				center: fromLonLat([34.8, 32.1]),
				zoom: 7,
			}),
		});

		const overlay = new Overlay({
			element: popupRef.current,
			positioning: "bottom-center",
			offset: [0, -15],
			autoPan: true,
		});

		map.addOverlay(overlay);

		mapRef.current = map;
		locationsSourceRef.current = locationsSource;

		map.on("singleclick", (event) => {
			const feature = map.forEachFeatureAtPixel(
				event.pixel,
				(feature) => feature,
			);

			if (!feature) {
				setSelectedFeature(null);
				overlay.setPosition(undefined);
				return;
			}

			setSelectedFeature(feature.getProperties());
			overlay.setPosition(event.coordinate);
		});

		return () => {
			map.setTarget(undefined);
			mapRef.current = null;
			locationsSourceRef.current = null;
		};
	}, []);

	useEffect(() => {
		const source = locationsSourceRef.current;
		const map = mapRef.current;

		if (!source || !map || !Array.isArray(data)) return;

		const features = data
			.filter((duty) => duty.location?.coordinates)
			.map((duty) => {
				return new Feature({
					geometry: new Point(fromLonLat(duty.location.coordinates)),
					name: duty.name ?? "unknown",
					status: duty.status ?? "unknown",
					description: duty.description ?? "unknown",
					_id: duty._id ?? "unknown",
				});
			});

		source.clear();
		source.addFeatures(features);

		if (features.length > 0) {
			map.getView().fit(source.getExtent(), {
				padding: [40, 40, 40, 40],
				maxZoom: 12,
			});
		}
	}, [data]);

	return (
		<Box sx={{ width: "100%", height: "500px" }}>
			<Box ref={mapElementRef} sx={{ width: "100%", height: "100%" }} />

			{isLoading && (
				<Box sx={{ position: "absolute", top: 10, left: 50 }}>
					Loading points...
				</Box>
			)}

			{isError && (
				<Box sx={{ position: "absolute", top: 10, left: 50 }}>
					Error loading the points: {error.message}
				</Box>
			)}

			<div ref={popupRef} className="map-popup">
				{selectedFeature && (
					<Box
						sx={{
							bgcolor: "background.paper",
							color: "text.primary",
							p: 2,
							borderRadius: 2.5,
							minWidth: 220,
							maxWidth: 280,
							border: 1,
							borderColor:
								selectedFeature.status === "scheduled"
									? "primary.main"
									: "error.main",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
						}}
					>
						<Stack spacing={1}>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="flex-start"
								spacing={1}
							>
								<Typography
									variant="subtitle1"
									sx={{
										fontWeight: 700,
										lineHeight: 1.3,
										wordBreak: "break-word",
									}}
								>
									{selectedFeature.name}
								</Typography>
								<IconButton
									size="small"
									aria-label="Close popup"
									onClick={() => setSelectedFeature(null)}
									sx={{ mt: -0.5, mr: -0.5, color: "text.secondary" }}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</Stack>

							<Chip
								label={selectedFeature.status}
								size="small"
								color={
									selectedFeature.status === "scheduled" ? "primary" : "error"
								}
								sx={{
									width: "fit-content",
									height: 22,
									fontSize: "0.7rem",
									textTransform: "capitalize",
								}}
							/>

							<Divider />

							<Typography variant="caption" color="text.secondary">
								<strong>ID:</strong> {selectedFeature._id}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ wordBreak: "break-word" }}
							>
								Description: {selectedFeature.description}
							</Typography>
						</Stack>
					</Box>
				)}
			</div>
		</Box>
	);
};

export default DutiesMap;
