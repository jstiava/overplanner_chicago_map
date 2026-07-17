// MapContext.tsx
import { createContext, useContext } from "react";
import maplibregl from "maplibre-gl";

export const MapContext = createContext<{
    map: maplibregl.Map | null,
    currentPosition: { lat: number, lng: number} | null
}>({
    map: null,
    currentPosition: null,
    
});

export function useMap() {
    return useContext(MapContext);
}