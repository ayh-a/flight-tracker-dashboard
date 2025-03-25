
export interface FlightSummaryStats {
    totalFlights: number;
    totalGroundedFlights: number;
    totalAirborneFlights: number;
    averageAltitude: number;
    maxAltitude: number;
    minAltitude: number;
    averageVelocity: number;
    minVelocity: number;
    maxVelocity: number;
  }

  export interface WeatherData {
    location: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
    conditionCode: number;
    conditionIcon: string;
    precipitation: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    airQuality: number;
  }

  export interface DashboardData {
    flightSummaryStats: FlightSummaryStats;
    WeatherData: WeatherData;
  }