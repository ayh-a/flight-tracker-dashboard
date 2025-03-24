"use client"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useState } from "react"
import { Plane } from "lucide-react"
import 'leaflet/dist/leaflet.css';

import { Card, CardContent } from "@/components/ui/card"

export default function FlightTrackerMap() {
  const [flightCount, setFlightCount] = useState(0)

  return (
    <Card className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="relative">
          <div id="map" className="w-full h-[475px] bg-gray-100">
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
          </div>

          {/* Flight count overlay */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md z-[1000]">
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