"use client"
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from "react"
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from "@/components/ui/card"

function LocationUpdater() {
    const map = useMap();
    
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setView([userLocation.lat, userLocation.lng], 10);
        }, (error) => {
          console.error("Error getting location: ", error);
        });
      }
    }, [map]);
    
    return null;
  }

export default function FlightTrackerMap() {
  const [flightCount, setFlightCount] = useState(0);
  
  return (
    <Card className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="relative">
          <div id="map" className="w-full h-[475px] bg-gray-100">
            <MapContainer 
              center={[43.653, -79.347]} 
              zoom={10} 
              scrollWheelZoom={false} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationUpdater />
            </MapContainer>
          </div>

          {/* Flight count overlay */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md z-[1000]">
            <div className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <span>
                  Flights: <span className="font-bold">{flightCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
