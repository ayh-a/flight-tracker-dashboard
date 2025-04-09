import FlightTrackerMap from "./components/map"
import Dashboard from "./components/Dashboard"
import React, { useEffect } from 'react';

import axios from 'axios';

// get initial tokens
const getAuthTokens = async () => {
  try {
    await axios.post('/auth/token');
    console.log('Authentication successful');
  } catch (error) {
    console.error('Authentication failed', error);
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // try to refresh the token
        await axios.post('/auth/refresh');
    
        // retry
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

useEffect(() => {
  getAuthTokens();
}, []);

function App() {
  return (
    <div className="container mx-auto p-4">
      <FlightTrackerMap />
      <Dashboard />
    </div>
  )
}

export default App

