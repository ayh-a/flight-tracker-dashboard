import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { FlightSummary } from './FlightSummary';
import { FlightConditions } from './FlightConditions';

export function Dashboard() {
  const { flightData, weatherData, loading, error } = useDashboardData();
  
  if (loading) {
    return <div className="p-4 text-center">Loading dashboard data...</div>;
  }
  
  if (error || !flightData || !weatherData) {
    return <div className="p-4 text-center text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 max-w-4xl mx-auto">
        <FlightSummary data={flightData} />
        <FlightConditions data={weatherData} />
    </div>
  );
}

export default Dashboard;