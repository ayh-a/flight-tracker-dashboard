import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind } from 'lucide-react';
import { WeatherData } from '../types/interfaces';

interface WeatherDataProps {
    data: WeatherData;
}
export function FlightConditions({data}: WeatherDataProps) {
    return (
        <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <Wind className="mr-2 h-5 w-5" />
            Flight Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Air Quality</p>
              <div className="flex items-center">
                <div 
                  className={`h-3 w-full rounded-full ${
                    data.airQuality < 50 ? 'bg-green-200' : 
                    data.airQuality < 100 ? 'bg-yellow-200' : 'bg-red-200'
                  }`}
                >
                  <div 
                    className={`h-full rounded-full ${
                      data.airQuality < 50 ? 'bg-green-500' : 
                      data.airQuality < 100 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(100, data.airQuality)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-bold">{data.airQuality}</span>
              </div>
              <p className="text-xs mt-1">
                {data.airQuality < 50 ? 'Good' : 
                 data.airQuality < 100 ? 'Moderate' : 'Poor'}
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Pressure</p>
              <p className="text-lg font-bold">{data.pressure} hPa</p>
              <p className="text-xs mt-1">
                {data.pressure < 1000 ? 'Low' : 
                 data.pressure > 1020 ? 'High' : 'Normal'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Flight Recommendation</p>
            <p className="text-sm">
              {data.windSpeed > 15 ? 'Caution: High Winds' :
               data.visibility < 5 ? 'Caution: Low Visibility' :
               data.precipitation > 0 ? 'Caution: Precipitation Present' :
               'Good Flying Conditions'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
};

export default FlightConditions;