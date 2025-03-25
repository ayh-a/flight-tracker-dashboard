"use client"
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useEffect, useState, useRef } from "react"
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from "@/components/ui/card"
import { Plane } from "lucide-react"
import planeSvg from '../assets/plane.svg';
import axios from 'axios';
import L from 'leaflet';

function createPlaneIcon(heading: number) {
    return L.divIcon({
      html: `<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%;"></div>`,
      className: '',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
  }

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
      if (!map) return;
      
      // Use a timeout to make sure the map has loaded properly
      const timer = setTimeout(() => {
        try {
          const bounds = map.getBounds();
          const boundingBox: BoundingBox = {
            minLat: bounds.getSouth(),
            maxLat: bounds.getNorth(),
            minLng: bounds.getWest(),
            maxLng: bounds.getEast()
          };
          onBoundsChange(boundingBox);
        } catch (error) {
          console.error("Map bounds not available yet:", error);
        }
      }, 500);
  
      // For moves
      const handleMoveEnd = () => {
        try {
          const newBounds = map.getBounds();
          const newBoundingBox: BoundingBox = {
            minLat: newBounds.getSouth(),
            maxLat: newBounds.getNorth(),
            minLng: newBounds.getWest(),
            maxLng: newBounds.getEast()
          };
          onBoundsChange(newBoundingBox);
        } catch (error) {
          console.error("Error getting map bounds:", error);
        }
      };
      
      map.on('moveend', handleMoveEnd);
  
      return () => {
        clearTimeout(timer);
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

  interface Flight {
    geoAltitude: number | null;
    longitude: number;
    latitude: number;
    velocity: number;
    heading: number;
    verticalRate: number | null;
    icao24: string;
    callsign: string;
    onGround: boolean;
    lastContact: number;
    lastPositionUpdate: number;
    originCountry: string;
    squawk: string | null;
    spi: boolean;
    baroAltitude: number | null;
    positionSource: string;
    serials: any | null;
  }
 
  interface FlightsInBoundsDTO {
    flights: Flight[] | null;
  }

export default function FlightTrackerMap() {
  const [flightCount, setFlightCount] = useState(0);
  const [bounds, setBounds] = useState<BoundingBox | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const boundsRef = useRef<BoundingBox | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const handleBoundsChange = (newBounds: BoundingBox) => {
    // Only update state if bounds have changed by a certain amount, reduces unnecessary re-renders
    if (!boundsRef.current || 
        Math.abs(newBounds.minLat - boundsRef.current.minLat) > 0.01 ||
        Math.abs(newBounds.maxLat - boundsRef.current.maxLat) > 0.01 ||
        Math.abs(newBounds.minLng - boundsRef.current.minLng) > 0.01 ||
        Math.abs(newBounds.maxLng - boundsRef.current.maxLng) > 0.01) {
      setBounds(newBounds);
    }
    
    boundsRef.current = newBounds;
  };

  const fetchFlightsData = async () => {
    if (!boundsRef.current || isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      const response = await axios.get<FlightsInBoundsDTO>('/api/flightsInBounds', {
        params: {
          minLat: boundsRef.current.minLat,
          maxLat: boundsRef.current.maxLat,
          minLng: boundsRef.current.minLng,
          maxLng: boundsRef.current.maxLng
        }
      });
      
      if (response.data.flights && response.data.flights.length > 0) {
        setFlights(response.data.flights);
        setFlightCount(response.data.flights.length);
      } else if (response.data.flights === null) {
        setFlights([]);
        setFlightCount(0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching flights data:', err);
      setError('Failed to fetch flights data');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (boundsRef.current) {
      fetchFlightsData();
    }
  
    const intervalId = setInterval(() => {
      if (boundsRef.current) {
        fetchFlightsData();
      }
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  useEffect(() => {
    if (bounds) {
      boundsRef.current = bounds;
      fetchFlightsData();
    }
  }, [bounds]);

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
              {flights.map((flight) => (
                <Marker
                    key={flight.icao24}
                    position={[flight.latitude, flight.longitude]}
                    icon={createPlaneIcon(flight.heading || 0)}
                    >
                    <Popup>
                        <div>
                            <h3 className='font-bold'>{flight.callsign?.trim() || 'Unknown'}</h3>
                            <p>Flight: {flight.icao24}</p>
                            <p>Altitude: {flight.geoAltitude ? Math.round(flight.geoAltitude) + ' m' : 'N/A'}</p>
                            <p>Speed: {Math.round(flight.velocity)} km/h</p>
                            <p>Heading: {Math.round(flight.heading)}°</p>
                            <p>Country: {flight.originCountry}</p>
                        </div>
                    </Popup>
                </Marker>
              ))}
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
