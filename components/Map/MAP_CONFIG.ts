export type MAP_CONFIG_SCHEMA = {
    'onLoad': {
        id: string,
        source: maplibregl.SourceSpecification | maplibregl.CanvasSourceSpecification,
        render: maplibregl.AddLayerObject[]
    }[]
}


export const MAP_CONFIG: MAP_CONFIG_SCHEMA = {
    'onLoad': [
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
            // ['4', '2', '3', '5', 'E', '1', '9', '99', 'RIV', '7', 'S', nan]
            id: "chicago_roads_with_permit_info",
            source: {
                type: 'geojson',
                data: "/maps/chicago_roads_with_permit_info.geojson"
            },
            render: [
                {
                    id: "chi_roads_with_permit_twoway",
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
                            "any",
                            [
                                "match",
                                ["get", "CLASS"],
                                ["1", "9"],
                                true,
                                false
                            ],
                            [
                                "==",
                                ["get", "ONEWAY_DIR"],
                                null
                            ]
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
                },
                {
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
                },
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
                        "text-font": ["Overpass Regular"],
                        "text-size": 10
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
        }

    ]
}