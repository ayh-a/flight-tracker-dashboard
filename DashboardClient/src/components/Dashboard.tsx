import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { FlightSummary } from './FlightSummary';
// Import your other dashboard components once they're created
// import { AltitudeStats } from './AltitudeStats';
// import { VelocityStats } from './VelocityStats';
// import { CurrentWeather } from './CurrentWeather';
// import { FlightConditions } from './FlightConditions';

export function Dashboard() {
  const { flightData, weatherData, loading, error } = useDashboardData();
  
  if (loading) {
    return <div className="p-4 text-center">Loading dashboard data...</div>;
  }
  
  if (error || !flightData || !weatherData) {
    return <div className="p-4 text-center text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      <FlightSummary data={flightData} />
      {/* Add your other dashboard components here */}
      {/* 
      <AltitudeStats data={flightData} />
      <VelocityStats data={flightData} />
      <CurrentWeather data={weatherData} />
      <FlightConditions data={weatherData} />
      */}
    </div>
  );
}

export default Dashboard;