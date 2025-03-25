"use client"
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from "react"
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from "@/components/ui/card"
import { Plane } from "lucide-react"
import axios from 'axios';

interface BoundingBox {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }

interface BoundsTrackerProps {
    onBoundsChange: (bounds: BoundingBox) => void;
  }

  function BoundsTracker({ onBoundsChange }: BoundsTrackerProps) {
    const map = useMap();
    
    useEffect(() => {
      const bounds = map.getBounds();
      const boundingBox: BoundingBox = {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast()
      };
      onBoundsChange(boundingBox);

      const handleMoveEnd = () => {
        const newBounds = map.getBounds();
        const newBoundingBox: BoundingBox = {
          minLat: newBounds.getSouth(),
          maxLat: newBounds.getNorth(),
          minLng: newBounds.getWest(),
          maxLng: newBounds.getEast()
        };
        onBoundsChange(newBoundingBox);
      };
      
      map.on('moveend', handleMoveEnd);

      return () => {
        map.off('moveend', handleMoveEnd);
      };
    }, [map, onBoundsChange]);
    
    return null;
  }

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
  const [bounds, setBounds] = useState<BoundingBox | null>(null);
  const handleBoundsChange = (newBounds: BoundingBox) => {
    setBounds(newBounds);
  };

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
              <BoundsTracker onBoundsChange={handleBoundsChange} />
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
  );
}
