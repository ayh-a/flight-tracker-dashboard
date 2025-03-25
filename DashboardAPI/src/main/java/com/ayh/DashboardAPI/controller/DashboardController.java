package com.ayh.DashboardAPI.controller;

import com.ayh.DashboardAPI.dto.DashboardSummaryDTO;
import com.ayh.DashboardAPI.dto.FlightsInBoundsDTO;
import com.ayh.DashboardAPI.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class DashboardController {
    DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Aggregated data based on user location.
     * Includes global flight summary and weather data based on lat and lon parameters.
     * Default location is Toronto
     *
     * @param lat
     * @param lon
     * @return DashboardSummaryDTO
     */
    @GetMapping("/dashboard")
    public DashboardSummaryDTO dashboard(
            @RequestParam(value = "lat", required = false, defaultValue = "43.65") double lat,
            @RequestParam(value = "lon", required = false, defaultValue = "-79.34") double lon) {
        try {
            return dashboardService.getAggregatedData(lat, lon);
        } catch (Exception e) {
            return new DashboardSummaryDTO(null, null);
        }
    }

    /**
     * All flights within a boundary box.
     *
     * @param minLat
     * @param maxLat
     * @param minLng
     * @param maxLng
     * @return FlightsInBoundsDTO
     */
    @GetMapping("/flightsInBounds")
    public FlightsInBoundsDTO flightsInBounds(
            @RequestParam("minLat") double minLat,
            @RequestParam("maxLat") double maxLat,
            @RequestParam("minLng") double minLng,
            @RequestParam("maxLng") double maxLng) {

        try {
            return dashboardService.getFlightsInBounds(minLat, maxLat, minLng, maxLng);
        } catch (Exception e) {
            return new FlightsInBoundsDTO(null);
        }
    }
}
