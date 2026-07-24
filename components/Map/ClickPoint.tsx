
'use client'

import { useEffect, useState } from "react";
import { useMap } from "./MapContext";
import { renderToStaticMarkup } from "react-dom/server";

export default function ClickPoint() {

    const { map } = useMap();


    const [selectedPoint, setSelectedPoint] = useState<{
        lng: number;
        lat: number;
    } | null>(null);

    useEffect(() => {
        if (!map) return;


        const handleClick = (e: maplibregl.MapMouseEvent) => {
            console.log(e)
            const clicked = point([e.lngLat.lng, e.lngLat.lat]);

            const buffer = 300;

            const roads = map.queryRenderedFeatures([
                [e.point.x - buffer, e.point.y - buffer],
                [e.point.x + buffer, e.point.y + buffer],
            ], {
                layers: ["chi_roads_with_permit_twoway_neg", "chi_roads_with_permit_twoway_pos", "chi_roads_with_permit_oneway"], // <-- your road layer id
            });

            if (!roads.length) {
                console.error("No roads exist")
                return
            };

            let best:
                | {
                    snapped: any;
                    feature: maplibregl.MapGeoJSONFeature;
                }
                | undefined;

            let bestDistance = Infinity;

            for (const feature of roads) {
                if (feature.geometry.type !== "LineString") continue;

                const snapped = nearestPointOnLine(feature as any, clicked);

                if (snapped.properties.dist < bestDistance) {
                    bestDistance = snapped.properties.dist;
                    best = {
                        snapped,
                        feature,
                    };
                }
            }

            if (!best) {
                console.error("No best roads found.");
                return;
            };

            const coords = (best.feature.geometry as GeoJSON.LineString).coordinates;

            const i = best.snapped.properties.index;

            const roadBearing = bearing(
                point(coords[Math.max(i - 1, 0)]),
                point(coords[Math.min(i + 1, coords.length - 1)])
            );

            const [lng, lat] = best.snapped.geometry.coordinates;

            const newSelectedPoint = {
                lng,
                lat,
                bearing: roadBearing,
            }

            console.log(newSelectedPoint)

            setSelectedPoint(newSelectedPoint);


            const source = map.getSource(
                "selected-car"
            ) as maplibregl.GeoJSONSource;

            source.setData({
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [lng, lat],
                        },
                        properties: {
                            bearing: roadBearing,
                        },
                    },
                ],
            });

            map.flyTo({
                center: [lng, lat],
                zoom: 18,
                pitch: 65,
                bearing: roadBearing,
                duration: 1000,
            });
        };

        map.on("click", handleClick);

        return () => {
            map.off("click", handleClick);
        };
    }, [map]);

    return null;
}


import { point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import bearing from "@turf/bearing";
import { Marker } from "maplibre-gl";
import { Car } from "lucide-react";


