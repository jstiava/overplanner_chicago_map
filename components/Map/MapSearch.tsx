'use client'
import { useCallback, useEffect, useState } from "react";
import { useMap } from "./MapContext";
import * as React from "react";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { InputGroup, InputGroupAddon } from "../ui/input-group";
import { Input } from "../ui/input";

type Place = {
    name: string;
    lat: number;
    lon: number;
};

export default function MapSearch() {

    const { map, ...MapContext } = useMap();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);

    const onSelect = useCallback((place: Place) => {
        if (!map) { return }

        const coords = [Number(place.lon), Number(place.lat)]

        map.flyTo({
            center: coords as any,
            zoom: 15,
        });

        const source = map.getSource("selected-place") as maplibregl.GeoJSONSource | undefined;

        source?.setData({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: coords,
                    },
                    properties: {},
                },
            ],
        });
    }, [map])

    useEffect(() => {

        if (query.length < 3) {
            setPlaces([]);
            return;
        }

        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(query)}` +
                    `&format=json` +
                    `&addressdetails=1` +
                    `&limit=8` +
                    `&viewbox=-88.4,42.45,-87.3,41.35` +
                    `&bounded=1`,
                    {
                        signal: controller.signal,
                        headers: {
                            "Accept-Language": "en",
                        },
                    }
                );

                const data = await res.json();

                const results: Place[] = data.map((item: any) => ({
                    name: item.display_name,
                    lat: Number(item.lat),
                    lon: Number(item.lon),
                }));

                setPlaces(results.slice(0, 8));
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };

    }, [query])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className={'w-full'}>
                <div className="p-1 pb-0 max-w-[400px] w-full shadow-md rounded-md">
                    <InputGroup className="h-10! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2! bg-white w-full flex gap-2"
                        role="combobox"
                        aria-expanded={open}
                    >
                        <div className="w-full text-left truncate text-sm outline-hidden disabled:cursor-not-allowed opacity-50"> {query || "Search address..."}</div>
                        <InputGroupAddon>
                            <SearchIcon className="size-4 shrink-0 opacity-50" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

            </PopoverTrigger>

            <PopoverContent 
                className="left-0 p-0 w-[var(--anchor-width)] max-w-[400px]"
                side="bottom"
                align="start"
                sideOffset={-44} // overlap the trigger
            >
                <Command shouldFilter={false}>
                    <CommandInput
                    className="w-full"
                        placeholder="Search address..."
                        value={query}
                        onValueChange={setQuery}
                    />

                    <CommandList>
                        {loading && (
                            <CommandEmpty>
                                Searching...
                            </CommandEmpty>
                        )}

                        {!loading && places.length === 0 && query.length >= 3 && (
                            <CommandEmpty>
                                No addresses found.
                            </CommandEmpty>
                        )}

                        <CommandGroup>
                            {places.map((place) => (
                                <CommandItem
                                    key={`${place.lat}-${place.lon}`}
                                    value={place.name}
                                    onSelect={() => {
                                        onSelect(place);
                                        setQuery(place.name);
                                        setOpen(false);
                                    }}
                                    className="p-0"
                                >
                                    <div className="flex w-full items-start gap-3 rounded-lg p-3">
                                        <div className="mt-1 rounded-full bg-muted p-2">
                                            📍
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-medium leading-none">
                                                {place.name.split(",")[0]}
                                            </span>

                                            <span className="mt-1 text-sm text-muted-foreground">
                                                {place.name
                                                    .split(",")
                                                    .slice(1)
                                                    .join(",")
                                                    .trim()}
                                            </span>

                                            <span className="mt-1 text-xs text-muted-foreground">
                                                {place.lat.toFixed(5)}, {place.lon.toFixed(5)}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}