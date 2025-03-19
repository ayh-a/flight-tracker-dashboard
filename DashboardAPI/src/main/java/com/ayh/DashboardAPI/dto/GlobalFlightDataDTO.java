package com.ayh.DashboardAPI.dto;

public record GlobalFlightDataDTO(FlightSummaryStatsDTO flightSummaryStats,
                                  WeatherDataDTO WeatherData) {
}
