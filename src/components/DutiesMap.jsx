import TileLayer from "ol/layer/Tile.js";
import OlMap from "ol/Map.js";
import OSM from "ol/source/OSM";
import View from "ol/View.js";
import { useEffect } from "react";
import "ol/ol.css";
import { Box } from "@mui/material";

export default function DutiesMap() {
	useEffect(() => {
		const map = new OlMap({
			target: "map",
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			view: new View({
				center: [0, 0],
				zoom: 2,
			}),
		});

		return () => {
			map.setTarget(null);
		};
	}, []);

	return <Box id="map" sx={{ width: "100%", height: "400px", p: 2 }} />;
}
