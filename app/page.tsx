'use server'
import { CTASystemGuide } from "@stiava/cta";
import Map from "@/components/Map/Map";

export default async function Home() {

  // const blue_line_stops = CTASystemGuide.readInTrainStationsByRoute("blue");
  // const brown_line_stops = CTASystemGuide.readInTrainStationsByRoute("brown");
  // const red_line_stops = CTASystemGuide.readInTrainStationsByRoute("red");
  // const orange_line_stops = CTASystemGuide.readInTrainStationsByRoute("orange");
  // const pink_line_stops = CTASystemGuide.readInTrainStationsByRoute("pink");
  // const yellow_line_stops = CTASystemGuide.readInTrainStationsByRoute("yellow");
  // const green_line_stops = CTASystemGuide.readInTrainStationsByRoute("green");

  return (
    <div className="w-[100vw] h-[100vh] relative overflow-hidden p-0">
      <Map />
    </div>
  );
}
