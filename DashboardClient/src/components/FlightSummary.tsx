import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FlightSummaryStats } from '../types/interfaces';

interface FlightSummaryProps {
  data: FlightSummaryStats;
}

export function FlightSummary({ data }: FlightSummaryProps) {
  //  data for the flight status pie chart
  const flightStatusData = [
    { name: 'Airborne', value: data.totalAirborneFlights },
    { name: 'Grounded', value: data.totalGroundedFlights }
  ];
  const COLORS = ['#0088FE', '#FF8042'];
      
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Plane className="mr-2 h-5 w-5" />
          Global Flight Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center justify-center bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Total Flights</p>
            <p className="text-2xl font-bold">{data.totalFlights}</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Airborne</p>
            <p className="text-2xl font-bold">{data.totalAirborneFlights}</p>
          </div>
        </div>

        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={flightStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {flightStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default FlightSummary;