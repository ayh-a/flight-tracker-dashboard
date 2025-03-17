package com.ayh.DashboardAPI.controller;

import com.ayh.DashboardAPI.dto.GlobalFlightDataDTO;
import com.ayh.DashboardAPI.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
     * Aggregated data based on user location
     * json reponse:
     *      - All state vectors for overall flight statistics
     *      - Start vectors within intial bounding box (defaulted to user location)
     *      - Weather based on user location
     */
    @GetMapping("/dashboard")
    public GlobalFlightDataDTO dashboard() throws IOException {
        try {
            return dashboardService.getAggregatedData();
        } catch (Exception e) {
            throw e;
        }
    }
}
