'use client'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react";
import { useMap } from "./MapContext";
import { Button } from "../ui/button";
import { NavigationIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function MapOptions() {

    const router = useRouter();
    const [showTrains, setShowTrains] = useState(true);
    const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
    const [hidden, setHidden] = useState(false);


    const [locationWatchStatus, setLocationWatchStatus] = useState<'dormant' | 'in_progress' | 'rejected' |
        'watching'>('dormant')
    const { map, currentPosition, setCurrentPosition } = useMap();

    const toggleTrains = () => {
        if (!map) return;

        const visible = !showTrains;
        setShowTrains(visible);

        map.setLayoutProperty(
            "cook_county_railroad_crossings",
            "visibility",
            visible ? "visible" : "none"
        );

        map.setLayoutProperty(
            "cook_raillines_only_high_activity_freight",
            "visibility",
            visible ? "visible" : "none"
        );
    };

    const getMyLocation = () => {

        if (!map) {
            console.error("Map does not exist yet.")
            return;
        }

        const highAccuracy = true;
        const sourceId = 'selected-place'
        const follow = true;
        setLocationWatchStatus('in_progress')

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

        map.setLayoutProperty(
            "selected-place",
            "visibility",
            "visible"
        );

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
                    } as any;

                    (
                        map.getSource(sourceId) as maplibregl.GeoJSONSource
                    ).setData(data);

                    if (follow) {
                        // map.easeTo({
                        //     center: [
                        //         coords.longitude,
                        //         coords.latitude,
                        //     ],
                        //     duration: 500,
                        // });
                        setCurrentPosition({ lat: coords.latitude, lng: coords.longitude })
                    }
                },
                console.error,
                {
                    enableHighAccuracy: highAccuracy,
                    maximumAge: 1000,
                }
            )

            setLocationWatchId(watchId)

            setLocationWatchStatus('watching')


        }
        catch (err) {
            setLocationWatchStatus('rejected')
            console.log("Could not get location.")
        }

    }

    useEffect(() => {

        return () => {
            if (locationWatchId) {
                navigator.geolocation.clearWatch(locationWatchId);
            }
        };
    }, [map, locationWatchId])

    return (

       <div className="flex w-full p-1">
         <div className="w-full rounded-md bg-white text-black h-fit flex flex-col px-4 py-1 shadow-md">
            <Accordion defaultValue={["item-1"]}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Layers & Settings</AccordionTrigger>
                    <AccordionContent className={'flex flex-col w-full p-4 py-6 gap-2'}>


                        {/*  */}
                        {/* <div className="flex w-full gap-2">
                            <Field>
                                <FieldLabel htmlFor="map_type">
                                    <FieldContent>
                                        <FieldTitle>Select map type</FieldTitle>
                                        <ToggleGroup value={['parking']} id="map_type">
                                            <ToggleGroupItem variant={'outline'} size={'lg'} value="parking" onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                router.push('/parking')
                                            }}>🅿️ Parking</ToggleGroupItem>
                                            <ToggleGroupItem variant={'outline'} size={'lg'} value="transit" onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                router.push('/transit')
                                            }}>Transit</ToggleGroupItem>
                                        </ToggleGroup>
                                    </FieldContent>
                                </FieldLabel>
                            </Field>
                        </div> */}


                        {/* Manage location services. */}
                        <div className="flex flex-col md:flex-row w-full justify-between gap-2">
                            {locationWatchStatus == 'dormant' && (
                                <Button key="dormant" onClick={e => { getMyLocation() }} size={'lg'} variant={'default'} className={'w-full'}><NavigationIcon /> Use my location</Button>
                            )}

                            {locationWatchStatus == 'in_progress' && (
                                <Button key="in_progress" onClick={e => { }} size={'lg'} variant={'outline'} className={'w-full'}><Spinner />Getting your location...</Button>
                            )}

                            {locationWatchStatus == 'rejected' && (
                                <Button key="rejected" onClick={e => { getMyLocation() }} size={'lg'} variant={'default'} className={'w-full'}><NavigationIcon /> Request location again</Button>
                            )}

                            {locationWatchStatus == 'watching' && (
                                <>
                                    <Button size={'lg'} variant={'outline'} className={'w-full md:w-[calc(50%-0.25rem)]'} onClick={e => {

                                        if (!map || !currentPosition) {
                                            return;
                                        }
                                        map.easeTo({
                                            center: [
                                                currentPosition.lng,
                                                currentPosition.lat,
                                            ],
                                            duration: 500,
                                        });
                                    }}><NavigationIcon /> See you are here</Button>
                                    <Button key="watching" onClick={e => {
                                        if (locationWatchId) {
                                            navigator.geolocation.clearWatch(locationWatchId);
                                        }
                                        setLocationWatchId(null);
                                        setLocationWatchStatus('dormant');
                                        if (map) {
                                            map.setLayoutProperty(
                                                "selected-place",
                                                "visibility",
                                                "none"
                                            );
                                        }
                                    }} size={'lg'} variant={'destructive'} className={'w-full md:w-[calc(50%-0.25rem)]'}><NavigationIcon /> End location tracking</Button>

                                </>
                            )}

                        </div>


                        {/* Layers */}
                        <FieldGroup className="w-full max-w-sm gap-2">
                            <FieldLabel htmlFor="show-trains">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Show Freight Line Crossings</FieldTitle>
                                        {/* <FieldDescription>
                                Focus is shared across devices, and turns off when you leave the
                                app.
                            </FieldDescription> */}
                                    </FieldContent>
                                    <Switch id="show-trains" onCheckedChange={e => toggleTrains()} checked={showTrains} />
                                </Field>
                            </FieldLabel>
                        </FieldGroup>


                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
       </div>
    )
}