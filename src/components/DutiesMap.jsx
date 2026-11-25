import TileLayer from "ol/layer/Tile.js";
import OlMap from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import View from "ol/View.js";
import { useEffect, useRef } from "react";
import "ol/ol.css";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorLayer from "ol/layer/Vector.js";
import { fromLonLat } from "ol/proj.js";
import VectorSource from "ol/source/Vector.js";
import { fetchAllDuties } from "../api/duties";

export default function DutiesMap() {
	const mapElementRef = useRef(null);
	const mapRef = useRef(null);
	const locationsSourceRef = useRef(null);

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

		mapRef.current = map;
		locationsSourceRef.current = locationsSource;

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

		console.log(data);

		const features = data
			.filter((duty) => duty.location?.coordinates)
			.map((duty) => {
				return new Feature({
					geometry: new Point(fromLonLat(duty.location.coordinates)),
					name: duty.name,
					status: duty.status ?? "",
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
		</Box>
	);
}
