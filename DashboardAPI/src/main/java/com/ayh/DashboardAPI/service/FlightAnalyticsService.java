package com.ayh.DashboardAPI.service;

import com.ayh.DashboardAPI.dto.FlightSummaryStatsDTO;
import org.opensky.model.StateVector;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightAnalyticsService {
    public FlightSummaryStatsDTO calculateSummaryStats(List<StateVector> flights) {
        if (flights == null || flights.isEmpty()) {
            return new FlightSummaryStatsDTO(0,0,0,0,0,0,0,0,0);
        }

        int totalFlights = getTotalFlights(flights);
        int totalGroundedFlights = getTotalGroundedFlights(flights);
        int totalAirborneFlights = totalFlights - totalGroundedFlights;
        SummaryStats velocityStats = calculateVelocitySummaryStats(flights);
        SummaryStats altitudeStats = calculateAltitudeSummaryStats(flights);

        return new FlightSummaryStatsDTO(totalFlights,
                                        totalGroundedFlights,
                                        totalAirborneFlights,
                                        altitudeStats.avg(),
                                        altitudeStats.max(),
                                        altitudeStats.min(),
                                        velocityStats.avg(),
                                        velocityStats.min(),
                                        velocityStats.max());
    }

    private int getTotalFlights(List<StateVector> flights) {
        return flights.size();
    }
    private int getTotalGroundedFlights(List<StateVector> flights) {
        int count = 0;
        for (StateVector flight: flights) {
            if (flight != null && flight.isOnGround())
                count++;
        }
        return count;
    }

    private SummaryStats calculateVelocitySummaryStats(List<StateVector> flights) {
        double min = Integer.MAX_VALUE;
        double max = Integer.MIN_VALUE;
        double sum = 0;
        int count = 0;

        for (StateVector flight : flights) {
            if (flight == null || flight.getVelocity() == null) {
                continue;
            }

            double velocity = flight.getVelocity();

            min = Math.min(min, velocity);
            max = Math.max(max, velocity);

            sum += velocity;
            count++;
        }

        if (count == 0) {
            return new SummaryStats(0, 0, 0);
        }

        double avg = sum / count;
        return new SummaryStats(max, min, avg);
    }

    private SummaryStats calculateAltitudeSummaryStats(List<StateVector> flights) {
        double min = Integer.MAX_VALUE;
        double max = Integer.MIN_VALUE;
        double sum = 0;
        int count = 0;

        for (StateVector flight : flights) {
            if (flight == null || flight.getGeoAltitude() == null) {
                continue;
            }

            double altitude = flight.getGeoAltitude();

            min = Math.min(min, altitude);
            max = Math.max(max, altitude);

            sum += altitude;
            count++;
        }

        if (count == 0) {
            return new SummaryStats(0, 0, 0);
        }

        double avg = sum / count;
        return new SummaryStats(max, min, avg);
    }

}

record SummaryStats(double max,
                    double min,
                    double avg) {}
