package com.ayh.DashboardAPI.service;

import com.ayh.DashboardAPI.dto.FlightSummaryStatsDTO;
import com.ayh.DashboardAPI.dto.GlobalFlightDataDTO;
import org.opensky.model.StateVector;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class DashboardService {
    OpenSkyApiService opensky;
    FlightAnalyticsService flightAnalyticsService;

    DashboardService(OpenSkyApiService opensky, FlightAnalyticsService flightAnalyticsService) {
        this.opensky = opensky;
        this.flightAnalyticsService = flightAnalyticsService;
    }

    /**
     * Note: Change return type for response for both weather and opensky data together
     */
    public GlobalFlightDataDTO getAggregatedData() throws IOException {
        List<StateVector> states;

        try {
            states = opensky.getAllStates();
            if (states == null) {
                states = Collections.emptyList();
            }
        } catch (Exception e) {
            FlightSummaryStatsDTO defaultStats = new FlightSummaryStatsDTO(0,0,0,0,0,0,0,0,0);
            return new GlobalFlightDataDTO(defaultStats);
        }

        FlightSummaryStatsDTO flightSummaryStatsDTO = flightAnalyticsService.calculateSummaryStats(states);
        return new GlobalFlightDataDTO(flightSummaryStatsDTO);
    }
}
