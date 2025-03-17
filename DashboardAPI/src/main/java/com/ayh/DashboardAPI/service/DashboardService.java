package com.ayh.DashboardAPI.service;

public class DashboardService {
    OpenSkyApiService opensky;

    DashboardService(OpenSkyApiService opensky) {
        this.opensky = opensky;
    }
}
