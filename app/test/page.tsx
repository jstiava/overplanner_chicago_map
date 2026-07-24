'use server'

import { getAllBusFromClientSide } from "@/lib/cta"

export default async function Page() {

    const buses = getAllBusFromClientSide();
    
    return (
        <div className="flex flex-col">
            <p className="debug">{JSON.stringify(buses)}</p>
        </div>
    )
}