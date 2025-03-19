package com.ayh.DashboardAPI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WeatherApiService implements ApiService{

    private final WebClient weatherWebClient;

    @Value("${apis.weather.key}")
    private String apiKey;

    WeatherApiService(WebClient weatherWebClient) {
        this.weatherWebClient = weatherWebClient;
    }

    public Mono<String> getWeather(double lat, double lon) {
        return weatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }


    /**
     * @return The name of the API
     */
    @Override
    public String getName() {
        return "weatherapi";
    }
}
