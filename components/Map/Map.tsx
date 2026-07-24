'use client'
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import Basemap from "./Basemap";
import { MapContext } from "./MapContext";
import ZoomIndicator from "./ZoomIndicator";
import WatchUserPosition from "./WatchPosition";
import MapSearch from "./MapSearch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { MAP_CONFIG } from "./MAP_CONFIG";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import MapOptions from "./MapOptions";
import ClickPoint from "./ClickPoint";
import MapCompass from "./MapCompass";



export default function Map() {

    const router = useRouter();
    const [map, setMap] = useState<maplibregl.Map | null>(null);
    const [currentPosition, setCurrentPosition] = useState<{ lat: number, lng: number} | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: {
                version: 8,
                sources: {},
                layers: [],
            },
            center: [-87.9, 41.98], // Center around chicago
            zoom: 11,
        });

        setMap(map);

        return () => map.remove();
    }, []);

    return (
        <>
            <MapContext.Provider value={{
                map,
                currentPosition,
                setCurrentPosition
            }}>
                <div ref={mapContainerRef} className="absolute inset-0" />
                <Basemap config={MAP_CONFIG} />
                <ClickPoint />
                <MapCompass />
                <div className="flex justify-between items-start fixed top-0 left-0 pt-2 px-2 py-2 z-10 w-[100vw]">
                    <div className="flex flex-col w-full gap-0  max-w-[400px]">
                        <MapSearch />
                        <MapOptions />
                    </div>
                </div>
                <div className="flex justify-between items-center fixed bottom-0 left-0 z-10  h-10 w-[100vw] bg-[#ffffff15] text-black">

                    <ZoomIndicator />
                    <div className="flex items-end h-full px-1 py-0 opacity-50">
                        <Button className={'p-0 m-0 leading-none'} variant={'link'} onClick={e => {
                            router.push("https://maplibre.org/")
                        }} >Made with MapLibre</Button>
                    </div>
                </div>
                {/* <WatchUserPosition /> */}
            </MapContext.Provider>
        </>
    )
}