'use client'

import { useEffect, useState } from "react";
import { useMap } from "../Map/MapContext"
import { MAP_CONFIG, MAP_CONFIG_SCHEMA } from "./MAP_CONFIG";
import { getAllBusFromClientSide, getAllStationsFromClientSide, getAllTrainsFromClientSide } from "@/lib/cta";
import { CTATrainService } from "@stiava/cta";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";




export default function CTABusPositions() {


    const { map, ...MapContext } = useMap();

    useEffect(() => {
        if (!map) return;

        const load = async () => {

            const buses = await getAllBusFromClientSide()


            const source = {
                type: "FeatureCollection",
                features: buses["bustime-response"].vehicle.map((bus) => {
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [Number(bus.lon), Number(bus.lat)],
                            },
                            properties: {
                                ...bus,
                                route: bus.rt,
                                id: bus.vid,
                                name: bus.vid,
                            },
                        }
                }),
            };

            if (!map.getSource('cta_bus_locations')) {


                map.addSource('cta_bus_locations', {
                    type: 'geojson',
                    data: source
                })
            }

            if (!map.getLayer('cta_bus_locations')) {

                map.addLayer({
                    id: 'cta_bus_locations',
                    type: 'circle',
                    source: 'cta_bus_locations',
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
                    id: "bus-label",
                    type: "symbol",
                    source: "cta_bus_locations",
                    layout: {
                        "text-field": ["to-string", ["get", "vid"]],
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


    return null;
}
