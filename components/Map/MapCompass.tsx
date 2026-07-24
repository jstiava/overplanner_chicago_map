import { Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap } from "./MapContext";
import { Button } from "../ui/button";

export default function MapCompass() {

  const { map } = useMap();

  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateBearing = () => {
      setBearing(map.getBearing());
    };

    updateBearing();

    map.on("rotate", updateBearing);

    return () => {
      map.off("rotate", updateBearing);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <Button variant={'secondary'} className={'flex h-12 w-12 p-0 m-0 rounded-full'} onClick={e => {
        if (!map) return;

        map.easeTo({
          bearing: 0,
          duration: 500,
          pitch: 0
        });
      }}>
       <div className="flex items-center justify-center h-12! w-12!">
         <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          style={{
            width: "36px !important",
            height: "36px !important",
            transform: `rotate(${bearing}deg)`,
          }}
        >
          {/* North arrow */}
          <path
            d="M18 4 L24 20 L18 16 L12 20 Z"
            fill="#ef4444"
          />

          {/* South tail */}
          <path
            d="M18 32 L22 18 L18 21 L14 18 Z"
            fill="#9ca3af"
          />

          {/* Center */}
          <circle
            cx="18"
            cy="18"
            r="2"
            fill="black"
          />

        </svg>
</div>      </Button>
    </div>
  );
}