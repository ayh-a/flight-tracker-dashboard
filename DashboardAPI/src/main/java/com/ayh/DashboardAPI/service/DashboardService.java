package com.ayh.DashboardAPI.service;

import com.ayh.DashboardAPI.dto.FlightSummaryStatsDTO;
import com.ayh.DashboardAPI.dto.DashboardSummaryDTO;
import com.ayh.DashboardAPI.dto.FlightsInBoundsDTO;
import com.ayh.DashboardAPI.dto.WeatherDataDTO;
import org.opensky.model.StateVector;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class DashboardService {
    OpenSkyApiService openskyService;
    FlightAnalyticsService flightAnalyticsService;
    WeatherApiService weatherService;

    DashboardService(OpenSkyApiService openskyService, FlightAnalyticsService flightAnalyticsService, WeatherApiService weatherService) {
        this.openskyService = openskyService;
        this.flightAnalyticsService = flightAnalyticsService;
        this.weatherService = weatherService;
    }

    /**
     * Note: Change return type for response for both weather and opensky data together
     */
    public DashboardSummaryDTO getAggregatedData(double lat, double lon) throws IOException {
        FlightSummaryStatsDTO flightStats = getFlightStats();
        WeatherDataDTO weatherData = weatherService.getWeather(lat, lon).block();

        return new DashboardSummaryDTO(flightStats, weatherData);
    }

    public FlightsInBoundsDTO getFlightsInBounds(double minLat, double maxLat, double minLng, double maxLng) throws IOException {
        List<StateVector> flights = openskyService.GetAllStatesInBoundingBox(minLat, maxLat, minLng, maxLng);

        return new FlightsInBoundsDTO(flights);
    }

    private FlightSummaryStatsDTO getFlightStats() throws IOException {
        try {
            List<StateVector> states = openskyService.getAllStates();
            return flightAnalyticsService.calculateSummaryStats(states);
        } catch (Exception e) {
            // Return default flight data on error
            return new FlightSummaryStatsDTO(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
}
