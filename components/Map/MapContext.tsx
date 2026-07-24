// MapContext.tsx
import { createContext, useContext } from "react";
import maplibregl from "maplibre-gl";

export const MapContext = createContext<{
    map: maplibregl.Map | null,
    currentPosition: { lat: number, lng: number} | null,
    setCurrentPosition: ((props: { lat: number, lng: number}) => any)
}>({
    map: null,
    currentPosition: null,
    setCurrentPosition: (props) => {}
});

export function useMap() {
    return useContext(MapContext);
}