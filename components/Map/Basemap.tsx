'use client'

import { useEffect } from "react";
import { useMap } from "./MapContext"
import { MAP_CONFIG, MAP_CONFIG_SCHEMA } from "./MAP_CONFIG";




export default function Basemap({
    config
} :{
    config: MAP_CONFIG_SCHEMA
}) {

    const {map, ...MapContext} = useMap();

    useEffect(() => {
        if (!map) return;

        const load = () => {
            for (const source of config.onLoad ?? []) {
                if (!map.getSource(source.id)) {
                    map.addSource(source.id, source.source);
                }

                for (const layer of source.render) {
                    if (!map.getLayer(layer.id)) {
                        map.addLayer(layer);
                    }
                }
            }
        };

        if (map.isStyleLoaded()) {
            load();
        } else {
            map.once("load", load);
        }

        return () => {
            map.off("load", load);
        };

    }, [map]);

    return null;
}


