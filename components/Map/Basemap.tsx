'use client'

import { useEffect } from "react";
import { useMap } from "./MapContext"
import { MAP_CONFIG, MAP_CONFIG_SCHEMA } from "./MAP_CONFIG";




export default function Basemap({
    config
}: {
    config: MAP_CONFIG_SCHEMA
}) {

    const { map, ...MapContext } = useMap();

    useEffect(() => {
        if (!map) return;

        const load = () => {

            const compiled_render_layers = config.onLoad.layers.map(layer => layer.render).flat()
            for (const sourceId of config.onLoad.order ?? []) {

                const layer = compiled_render_layers.find(x => x.id == sourceId);

                const source = config.onLoad.layers.find(x => x.id == layer?.source);

                if (!layer || !source) {
                    continue;
                }

                if (!map.getSource(source.id)) {
                    map.addSource(source.id, source.source);
                }

                if (layer.renderBefore) {
                    const { renderBefore, ...rest } = layer;
                    if (!map.getLayer(rest.id)) {
                        map.addLayer(rest, renderBefore);
                    }
                }
                else {
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


