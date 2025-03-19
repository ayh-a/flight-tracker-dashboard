package com.ayh.DashboardAPI.dto;

public record WeatherDataDTO(String location,
                             double temperature,
                             double feelsLike,
                             int humidity,
                             double windSpeed,
                             String windDirection,
                             String condition,
                             int conditionCode,
                             String conditionIcon,
                             double precipitation,
                             double visibility,
                             double airQuality) {

    public static WeatherDataDTO createDefault() {
        return new WeatherDataDTO(
                "Unknown", 0.0, 0.0, 0, 0.0, "Unknown",
                "Unknown", 0, "", 0, 0.0, 0.0);
    }
}
