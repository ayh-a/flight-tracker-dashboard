package com.ayh.DashboardAPI.service;

import org.springframework.beans.factory.annotation.Value;

public class WeatherApiService implements ApiService{

    WeatherApiService(@Value("${apis.weather.key}") String apiKey) {

    }


    /**
     * @return The name of the API
     */
    @Override
    public String getName() {
        return "weatherapi";
    }
}
