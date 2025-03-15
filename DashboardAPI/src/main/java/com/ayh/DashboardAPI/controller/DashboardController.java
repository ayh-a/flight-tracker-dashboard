package com.ayh.DashboardAPI.controller;

import com.ayh.DashboardAPI.service.OpenSkyApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {
    /**
     * Aggregated data based on user location
     */
    @GetMapping("/dashboard")
    public void dashboard() {

    }
}
