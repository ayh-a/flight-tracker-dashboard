"use client"

import { useState } from "react"
import { Plane } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function FlightTrackerMap() {
  const [flightCount, setFlightCount] = useState(0)

  return (
    <Card className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="relative">
          {/* This div will be your Leaflet map container */}
          <div id="map" className="w-full h-[475px] bg-gray-100">
            {/* Leaflet will be mounted here */}
          </div>

          {/* Flight count overlay */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md">
            <div className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                <span>
                  Flights: <span className="font-bold">{flightCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}