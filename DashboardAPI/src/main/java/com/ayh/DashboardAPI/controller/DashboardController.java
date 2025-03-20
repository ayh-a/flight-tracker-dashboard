package com.ayh.DashboardAPI.controller;

import com.ayh.DashboardAPI.dto.GlobalFlightDataDTO;
import com.ayh.DashboardAPI.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
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
     */
    @GetMapping("/dashboard")
    public GlobalFlightDataDTO dashboard(
            @RequestParam(value = "lat", required = false, defaultValue = "43.65") double lat,
            @RequestParam(value = "lon", required = false, defaultValue = "-79.34") double lon) {
        try {
            return dashboardService.getAggregatedData(lat, lon);
        } catch (Exception e) {
            return new GlobalFlightDataDTO(null, null);
        }
    }
}
