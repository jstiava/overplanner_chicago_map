'use client'

import { useEffect, useState } from "react";
import { useMap } from "../Map/MapContext"
import { MAP_CONFIG, MAP_CONFIG_SCHEMA } from "./MAP_CONFIG";
import { getAllStationsFromClientSide, getAllTrainsFromClientSide } from "@/lib/cta";
import { CTATrainService } from "@stiava/cta";




export default function CTATrainStations() {


    const { map, ...MapContext } = useMap();
    useEffect(() => {
        if (!map) return;

        const load = async () => {

            const stations = await getAllStationsFromClientSide()

            const source = {
                type: "FeatureCollection",
                features: stations.map((point: any) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [point.stop_lon, point.stop_lat],
                    },
                    properties: {
                        ...point,
                        id: point.stop_id,
                        name: point.naive_station_name,
                    },
                })),
            };

            if (!map.getSource('cta_stations_points')) {

                
                map.addSource('cta_stations_points', {
                    type: 'geojson',
                    data: source
                })
            }

            if (!map.getLayer('cta_stations_points')) {

                map.addLayer({
                    id: 'cta_stations_points',
                    type: "circle",
                    source: 'cta_stations_points',
                    paint: {
                        "circle-radius": 4,
                        "circle-color": [
                            "match",
                        ["get", "lines"],
                        "red", "#c60c30",
                        "purple, red", "#c60c30",
                        "blue", "#00a1de",
                        "brown", "#62361b",
                        "green", "#009b3a",
                        "orange", "#f9461c",
                        "pink", "#e27ea6",
                        "purple", "#522398",
                        "yellow", "#f9e300",
                        "#888888"
                    ],
                    "circle-stroke-color": "#fff",
                    "circle-stroke-width": 2,
                    //  "line-color": 
                },
            })
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
