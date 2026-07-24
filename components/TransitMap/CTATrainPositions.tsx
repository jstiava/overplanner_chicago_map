'use client'

import { useEffect, useState } from "react";
import { useMap } from "../Map/MapContext"
import { MAP_CONFIG, MAP_CONFIG_SCHEMA } from "./MAP_CONFIG";
import { getAllStationsFromClientSide, getAllTrainsFromClientSide } from "@/lib/cta";
import { CTATrainService } from "@stiava/cta";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";




export default function CTATrainPositions() {


    const { map, ...MapContext } = useMap();
    const [hovered, setHovered] = useState<{
        x: number,
        y: number,
        properties: Awaited<ReturnType<typeof getAllTrainsFromClientSide>>[number]['train'][number]
    } | null>(null);

    useEffect(() => {
        if (!map) return;

        const load = async () => {

            const trains = await getAllTrainsFromClientSide()


            const source = {
                type: "FeatureCollection",
                features: trains.map((route) => {
                    return route.train.map((train) => {

                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [train.lon, train.lat],
                            },
                            properties: {
                                ...train,
                                route: route['@name'],
                                id: train.rn,
                                name: train.rn,
                            },
                        }
                    })

                }).flat(),
            };

            if (!map.getSource('cta_train_locations')) {


                map.addSource('cta_train_locations', {
                    type: 'geojson',
                    data: source
                })
            }

            if (!map.getLayer('cta_train_locations')) {

                map.addLayer({
                    id: 'cta_train_locations',
                    type: 'circle',
                    source: 'cta_train_locations',
                    paint: {
                        "circle-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            10, 8,
                            15, 12,
                            18, 18
                        ],
                        "circle-color": "#1976d2",
                        "circle-stroke-color": "#fff",
                        "circle-stroke-width": 2,
                    },
                })

                map.addLayer({
                    id: "train-label",
                    type: "symbol",
                    source: "cta_train_locations",
                    layout: {
                        "text-field": ["to-string", ["get", "rn"]],
                        "text-size": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            10, 9,
                            15, 12,
                            18, 15
                        ],
                        "text-font": ["Overpass Bold"],
                        "text-allow-overlap": true,
                        "text-ignore-placement": true,
                    },
                    paint: {
                        "text-color": "#fff",
                    },
                });
            }

            map.on("mousemove", "cta_train_locations", (e) => {
                const feature = e.features?.[0];
                console.log({
                    action: "mousemove_cta_train_locations",
                    feature
                })
                if (!feature) return;

                setHovered({
                    x: e.point.x,
                    y: e.point.y,
                    properties: feature.properties,
                });

                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "cta_train_locations", () => {
                 console.log({
                    action: "mouseleave_cta_train_locations",
                    hovered: null
                })
                setHovered(null);
                map.getCanvas().style.cursor = "";
            });





        }

        if (map.isStyleLoaded()) {
            load();
        } else {
            map.once("load", load);
        }

        return () => {
            map.off("load", load);
        };

    }, [map])


    return (
        <>
            {hovered && (
                <Card
                    className="pointer-events-none absolute z-50 w-64 rounded-sm"
                    style={{
                        left: hovered.x + 12,
                        top: hovered.y + 12,
                    }}
                >
                    <CardHeader>
                        <CardTitle>Run {hovered.properties.rn}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-1 text-sm">
                        <div>Heading: {hovered.properties.heading}°</div>
                        <div>Next: {hovered.properties.nextStaNm}</div>
                        <div>to {hovered.properties.destNm}</div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
