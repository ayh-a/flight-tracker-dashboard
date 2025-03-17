package com.ayh.DashboardAPI.dto;

public record FlightSummaryStatsDTO(
        int totalFlights,
        int totalGroundedFlights,
        int totalAirborneFlights,
        double averageAltitude,
        double maxAltitude,
        double minAltitude,
        double averageVelocity,
        double minVelocity,
        double maxVelocity) {
}
