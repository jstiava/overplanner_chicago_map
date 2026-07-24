'use server'

import { CTABusService, CTASystemGuide, CTATrainService } from "@stiava/cta"


export async function getAllStationsFromClientSide() {

    const blue = CTASystemGuide.readInTrainStationsByRoute('blue');
    const red = CTASystemGuide.readInTrainStationsByRoute('red');
    const orange = CTASystemGuide.readInTrainStationsByRoute('orange');
    const green = CTASystemGuide.readInTrainStationsByRoute('green');
    const pink = CTASystemGuide.readInTrainStationsByRoute('pink');
    const yellow = CTASystemGuide.readInTrainStationsByRoute('yellow');
    const brown = CTASystemGuide.readInTrainStationsByRoute('brown');

    return [blue, red, orange, green, pink, yellow, brown].flat()

}


export async function getAllTrainsFromClientSide() {

    const CTATrains = new CTATrainService(String(process.env.CTA_TRAIN_TRACKER_API_KEY));

    const blueTrains = await CTATrains.getTrainLocationsByRoute('blue');
    const redTrains = await CTATrains.getTrainLocationsByRoute('red');

    return [blueTrains.ctatt.route, redTrains.ctatt.route].flat()
}


export type CTABus = {
    "vid": string, 
    "tmstmp": string,
    "lat": string,
    "lon": string,
    "hdg": string, 
    "pid": number, 
    "rt": string,
    "des": string,
    "pdist": number, 
    "dly": boolean, 
    "tatripid": string,
    "origtatripno": string,
    "tablockid": string,
    "zone": string, 
    "mode": number, 
    "psgld": string, 
    "stst": number, 
    "stsd": string,
}

export async function getAllBusFromClientSide(): Promise<{
    "bustime-response": {
        "vehicle": CTABus[]
    }
}> {
    const CTABuses = new CTABusService(String(process.env.CTA_BUS_TRACKER_API_KEY));
    return await CTABuses.getVehiclesByRoutes(['152']);
}