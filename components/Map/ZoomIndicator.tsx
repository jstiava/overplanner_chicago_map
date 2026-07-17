
'use client'

import { useEffect, useState } from "react";
import { useMap } from "./MapContext";

export default function ZoomIndicator() {

    const {map, ...MapContext} = useMap();
    const [zoom, setZoom] = useState(0)

    useEffect(() => {
        if (!map) return;

        const update = () => setZoom(map.getZoom());

        map.on("zoom", update);

    }, [map]);

    return (
        <div className="rounded bg-white py-1 px-2 text-sm text-black font-mono shadow">
            Zoom: {zoom.toFixed(2)}
        </div>
    );
}