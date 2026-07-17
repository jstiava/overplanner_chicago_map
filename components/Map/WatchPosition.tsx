import { useEffect } from "react";
import { useMap } from "./MapContext";

interface WatchUserLocationProps {
    follow?: boolean;
    highAccuracy?: boolean;
}

export default function WatchUserPosition({
    follow = false,
    highAccuracy = true,
}: WatchUserLocationProps) {

    const { map, ...MapContext } = useMap();

    useEffect(() => {
        if (!map) return;

        const sourceId = "user-location";

        const initialize = () => {
            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                });

                map.addLayer({
                    id: "user-location",
                    type: "circle",
                    source: sourceId,
                    paint: {
                        "circle-radius": 8,
                        "circle-color": "#3b82f6",
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#fff",
                    },
                });
            }

            try {
                const watchId = navigator.geolocation.watchPosition(
                    ({ coords }) => {
                        const data = {
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    geometry: {
                                        type: "Point",
                                        coordinates: [
                                            coords.longitude,
                                            coords.latitude,
                                        ],
                                    },
                                    properties: {},
                                },
                            ],
                        };

                        (
                            map.getSource(sourceId) as maplibregl.GeoJSONSource
                        ).setData(data);

                        if (follow) {
                            map.easeTo({
                                center: [
                                    coords.longitude,
                                    coords.latitude,
                                ],
                                duration: 500,
                            });
                        }
                    },
                    console.error,
                    {
                        enableHighAccuracy: highAccuracy,
                        maximumAge: 1000,
                    }
                )

                cleanup = () => {
                    navigator.geolocation.clearWatch(watchId);

                    if (map.getLayer(sourceId))
                        map.removeLayer(sourceId);

                    if (map.getSource(sourceId))
                        map.removeSource(sourceId);
                };

            }
            catch (err) {

                console.log("Could not get location.")
            }
        };

        let cleanup = () => { };

        if (map.isStyleLoaded()) {
            initialize();
        } else {
            map.once("load", initialize);
        }

        return () => cleanup();

    }, [map, follow, highAccuracy]);

    return null;
}