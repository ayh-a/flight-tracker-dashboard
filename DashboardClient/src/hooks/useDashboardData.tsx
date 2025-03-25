import { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardData } from '../types/interfaces';

export function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const response = await axios.get<DashboardData>('/api/dashboard');
          setData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Failed to fetch dashboard data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardData();

      const intervalId = setInterval(fetchDashboardData, 30000); // update every 30 seconds (api polling)
      
      return () => clearInterval(intervalId);
    }, []);
  
    return { 
      data,
      flightData: data?.flightSummaryStats,
      weatherData: data?.WeatherData,
      loading, 
      error 
    };
  }