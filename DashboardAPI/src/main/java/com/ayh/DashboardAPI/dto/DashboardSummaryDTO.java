package com.ayh.DashboardAPI.dto;

public record DashboardSummaryDTO(FlightSummaryStatsDTO flightSummaryStats,
                                  WeatherDataDTO WeatherData) {
}
