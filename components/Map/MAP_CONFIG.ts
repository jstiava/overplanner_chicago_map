export type MAP_CONFIG_SCHEMA = {
    'onLoad': {
        order: string[],
        layers: {
            id: string,
            source: maplibregl.SourceSpecification | maplibregl.CanvasSourceSpecification,
            render: (
                maplibregl.AddLayerObject & { source: string, renderBefore?: string }
            )[]
        }[]
    }
}




const chi_roads_twoway_pos = {
    id: "chi_roads_twoway_pos",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            ["1", "2", "3", "4", "9"],
            true,
            false
        ],
        [
            "==",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            ["==", ["get", "CLASS"], "2"], '#b1b1b1',
            // None or fallback
            "lightgray"
        ],
        "line-offset": [
            "case",
            ["==", ['get', 'CLASS'], "1"], 2,
            ["==", ['get', 'CLASS'], "2"], 2,
            1.5
        ],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}

const chi_roads_oneway = {
    id: "chi_roads_with_permit_oneway",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            // ["2", "3", "4"],
            ["2", "3", "4", "5", "S", "E"],
            true,
            false
        ],
        [
            "!=",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            // CLASS 1 roads are always gray
            ["match", ["get", "CLASS"], ["1", "9"], true, false],
            "#3d3d3d",
            // None or fallback
            "lightgray"
        ],
        "line-dasharray": [1.5, 1.5],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}

const chi_roads_with_permit_oneway = {
    id: "chi_roads_with_permit_oneway",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            // ["2", "3", "4"],
            ["2", "3", "4", "5", "S", "E"],
            true,
            false
        ],
        [
            "!=",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            // CLASS 1 roads are always gray
            ["match", ["get", "CLASS"], ["1", "9"], true, false],
            "#3d3d3d",

            // Paid streets
            ["==", ["get", "is_paid"], true],
            "#ff0000",

            // Permit status
            ["==", ["get", "permit_status"], "Both"],
            "#ff8c00",

            ["match", ["get", "permit_status"], ["Left", "Right"], true, false],
            "#00ffdd",

            // None or fallback
            "lightgray"
        ],
        "line-dasharray": [1.5, 1.5],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}


const chi_roads_twoway_neg = {
    id: "chi_roads_twoway_neg",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            ["2", "3", "4"],
            true,
            false
        ],
        [
            "==",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            ["==", ["get", "CLASS"], "2"], '#b1b1b1',

            // None or fallback
            "lightgray"
        ],
        "line-offset": [
            "case",
            ["==", ['get', 'CLASS'], "1"], -2,
            ["==", ['get', 'CLASS'], "2"], -2,
            -1.5
        ],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}





const chi_roads_with_permit_twoway_pos = {
    id: "chi_roads_with_permit_twoway_pos",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            ["1", "2", "3", "4", "9"],
            true,
            false
        ],
        [
            "==",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            ["==", ["get", "CLASS"], "2"], '#b1b1b1',

            // Paid streets
            ["==", ["get", "is_paid"], true],
            "#ff0000",

            // Permit status
            ["==", ["get", "permit_status"], "Both"],
            "#ff8c00",

            ["match", ["get", "permit_status"], ["Left", "Right"], true, false],
            "#00ffdd",

            // None or fallback
            "lightgray"
        ],
        "line-offset": [
            "case",
            ["==", ['get', 'CLASS'], "1"], 2,
            ["==", ['get', 'CLASS'], "2"], 2,
            1.5
        ],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}


const chi_roads_with_permit_twoway_neg = {
    id: "chi_roads_with_permit_twoway_neg",
    type: "line",
    source: "chicago_roads_with_permit_info",
    filter: [
        "all",
        [
            "match",
            ["get", "CLASS"],
            ["1", "2", "3", "4", "9"],
            true,
            false
        ],
        [
            "==",
            ["get", "ONEWAY_DIR"],
            null
        ]
    ],
    paint: {
        "line-color": [
            "case",

            ["==", ["get", "CLASS"], "2"], '#b1b1b1',

            // Paid streets
            ["==", ["get", "is_paid"], true],
            "#ff0000",

            // Permit status
            ["==", ["get", "permit_status"], "Both"],
            "#ff8c00",

            ["match", ["get", "permit_status"], ["Left", "Right"], true, false],
            "#00ffdd",

            // None or fallback
            "lightgray"
        ],
        "line-offset": [
            "case",
            ["==", ['get', 'CLASS'], "1"], -2,
            ["==", ['get', 'CLASS'], "2"], -2,
            -1.5
        ],
        "line-width": [
            "case",

            // Major roads
            ["==", ["get", "CLASS"], "1"], 4,
            [
                "any",
                ["==", ["get", "CLASS"], "2"],
                ["==", ["get", "STREET_NAM"], "MILWAUKEE"],
                ["==", ["get", "STREET_NAM"], "OGDEN"]
            ], 4,

            // All other roads (including CLASS 1)
            2
        ]
    }
}





export const MAP_CONFIG: MAP_CONFIG_SCHEMA = {
    'onLoad': {
        order: [
            'chicago_area',
            'cook_without_chicago',
            'water-fill',
            'chicago_parks',
            'cook_forest_preserves',
            'chi_roads_with_permit_oneway',
            'chi_roads_with_permit_twoway_neg',
            'chi_roads_with_permit_twoway_pos',
            'chi_roads_highways',
            'cook_raillines_only_high_activity_freight',
            'road-labels',
            'road-labels-local',
            'selected-place',
            'selected-car',
            'cubs_lv2_zone',
            'cook_county_railroad_crossings'
        ],
        layers: [
            {
                id: "chicago_area",
                source: {
                    type: 'geojson',
                    data: "/maps/chicago_area.geojson"
                },
                render: [
                    {
                        id: "chicago_area",
                        type: "fill",
                        source: "chicago_area",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#ffffff",
                        },
                    }
                ]
            },
            {
                id: "cook_without_chicago",
                source: {
                    type: 'geojson',
                    data: "/maps/cook_without_chicago.geojson"
                },
                render: [
                    {
                        id: "cook_without_chicago",
                        type: 'fill',
                        source: "cook_without_chicago",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#eee8dd",
                        },
                    }
                ]
            },
            {
                id: "chicago_area_water",
                source: {
                    type: 'geojson',
                    data: "/maps/chicago_area_water.geojson"
                },
                render: [
                    {
                        id: "water-fill",
                        type: "fill",
                        source: "chicago_area_water",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#90daee",
                        },
                    }
                ]
            },
            {
                id: "chicago_parks",
                source: {
                    type: 'geojson',
                    data: "/maps/chicago_parks.geojson"
                },
                render: [
                    {
                        id: "chicago_parks",
                        type: "fill",
                        source: "chicago_parks",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#c3f1d5",
                        },
                    }
                ]
            },
            {
                id: "cook_forest_preserves",
                source: {
                    type: 'geojson',
                    data: "/maps/cook_forest_preserves.geojson"
                },
                render: [
                    {
                        id: "cook_forest_preserves",
                        type: "fill",
                        source: "cook_forest_preserves",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#c3f1d5",
                        },
                    }
                ]
            },

            {
                id: "cubs_lv2_zone",
                source: {
                    type: 'geojson',
                    data: "/maps/chicago_lv2_wrigley_parking_zone.geojson"
                },
                render: [
                    {
                        id: "cubs_lv2_zone",
                        type: "fill",
                        source: "cubs_lv2_zone",
                        'layout': {},
                        // filter: ["==", "$type", "Polygon"],
                        paint: {
                            "fill-color": "#b029da",
                            'fill-opacity': 0.5
                        },
                    }
                ]
            },

            {
                // ['4', '2', '3', '5', 'E', '1', '9', '99', 'RIV', '7', 'S', nan]
                id: "chicago_roads_with_permit_info",
                source: {
                    type: 'geojson',
                    data: "/maps/chicago_roads_with_permit_info.geojson"
                },
                render: [
                    {
                        id: "chi_roads_highways",
                        type: "line",
                        source: "chicago_roads_with_permit_info",
                        filter: [
                            "all",
                            [
                                "match",
                                ["get", "CLASS"],
                                ["1", "9"],
                                true,
                                false
                            ]
                        ],
                        paint: {
                            "line-color": '#979797',
                            "line-width": [
                                "case",

                                // Major roads
                                ["==", ["get", "CLASS"], "1"], 4,
                                // All other roads (including CLASS 1)
                                2
                            ]
                        }
                    },
                    chi_roads_with_permit_twoway_neg,
                    chi_roads_with_permit_twoway_pos,
                    chi_roads_with_permit_oneway,
                    {
                        id: "road-labels",
                        type: "symbol",
                        source: "chicago_roads_with_permit_info",

                        filter: [
                            "match",
                            ["get", "CLASS"],
                            ["2", "3"],
                            true,
                            false
                        ],

                        layout: {
                            "symbol-placement": "line",
                            "text-field": ["get", "STREET_NAM"],
                            "text-size": [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10, 10,
                                14, 14,
                                18, 18
                            ],
                            "text-allow-overlap": false,
                            "symbol-spacing": 500,
                            "text-font": ["Overpass"], 
                        },

                        paint: {
                            "text-color": "#333",
                            "text-halo-color": "#ffffff",
                            "text-halo-width": 2,
                        }
                    },
                    {
                        id: "road-labels-local",
                        type: "symbol",
                        source: "chicago_roads_with_permit_info",

                        filter: [
                            "match",
                            ["get", "CLASS"],
                            ["4"],
                            true,
                            false
                        ],

                        layout: {
                            "symbol-placement": "line",
                            "text-field": ["get", "street_key"],
                            // "text-field": ["get", "street_key"],
                            "text-font": ["Overpass Regular"],
                            "text-size": 10,
                            
                        },

                        paint: {
                            "text-color": "#555",
                            "text-halo-color": "#fff",
                            "text-halo-width": 1.5
                        },

                        minzoom: 13.5
                    }
                ]
            },
            {
                id: "cta_trainlines",
                source: {
                    type: 'geojson',
                    data: "/maps/cta_trainlines.geojson"
                },
                render: [
                    {
                        id: "cta_trainlines_buffer",
                        type: "line",
                        source: "cta_trainlines",
                        layout: {
                            "line-cap": "round",
                            "line-join": "round"
                        },

                        paint: {
                            "line-color": "#ffffff",

                            "line-width": [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10, 5,
                                14, 8,
                                18, 11
                            ]
                        }
                    },
                    {
                        id: "cta_trainlines",
                        type: "line",
                        source: "cta_trainlines",
                        layout: {
                            "line-cap": "round",
                            "line-join": "round",
                        },

                        paint: {
                            "line-color": [
                                "match",
                                ["get", "lines"],

                                "Red Line", "#c60c30",
                                "Red, Purple Line", "#c60c30",
                                "Blue Line (O'Hare)", "#00a1de",
                                "Blue Line (Forest Park)", "#00a1de",
                                "Brown Line", "#62361b",
                                "Green Line", "#009b3a",
                                "Orange Line", "#f9461c",
                                "Pink Line", "#e27ea6",
                                "Purple Line", "#522398",
                                "Yellow Line", "#f9e300",

                                "#888888"
                            ],

                            "line-width": [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10, 2,
                                14, 5,
                                18, 8
                            ]
                        }

                    }
                ]
            },
            {
                id: "selected-place",
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                },
                render: [
                    {
                        id: "selected-place",
                        type: "circle",
                        source: "selected-place",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": "#ef4444",
                            "circle-stroke-color": "#fff",
                            "circle-stroke-width": 2,
                        },
                    }
                ]
            },
            {
                id: "selected-car",
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                },
                render: [
                    {
                        id: "selected-car",
                        type: "circle",
                        source: "selected-car",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": "#ef4444",
                            "circle-stroke-color": "#fff",
                            "circle-stroke-width": 2,
                        },
                    }
                ]
            },
            {
                id: 'cook_raillines_only_high_activity_freight',
                source: {
                    type: 'geojson',
                    data: 'maps/cook_raillines_only_high_activity_freight.geojson'
                },
                render: [
                    {
                        id: 'cook_raillines_only_high_activity_freight',
                        type: "line",
                        source: 'cook_raillines_only_high_activity_freight',
                        paint: {
                            "line-color": 'grey',
                            "line-width": [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10, 2,
                                14, 5,
                                18, 8
                            ]
                        }
                    }
                ]
            },
            {
                id: 'cook_county_railroad_crossings',
                source: {
                    type: "geojson",
                    data: 'maps/cook_county_railroad_crossings.geojson'
                },
                render: [
                    {
                        id: "cook_county_railroad_crossings",
                        type: "circle",
                        source: "cook_county_railroad_crossings",
                        paint: {
                            "circle-color": [
                                "case",
                                ["==", ["get", "grade"], "At Grade"],
                                "#000", // hide circles for at-grade crossings
                                "#44ef86"
                            ]
                        }
                    }
                ]
            }

        ]
    }
}

