package com.ayh.DashboardAPI.service;

import com.ayh.DashboardAPI.dto.WeatherDataDTO;
import com.fasterxml.jackson.databind.JsonNode;
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

    public Mono<WeatherDataDTO> getWeather(double lat, double lon) {
        return weatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::parseWeatherData)
                .onErrorResume(e ->  {
                    return Mono.just(WeatherDataDTO.createDefault());
                });
    }
    private WeatherDataDTO parseWeatherData(JsonNode root) {
        try {
            if (root.has("data") && root.get("data").isArray() && root.get("data").size() > 0) {
                JsonNode data = root.get("data").get(0);
                JsonNode weather = data.get("weather");

                String cityName = data.get("city_name").asText();
                String stateCode = data.get("state_code").asText();
                String location = cityName + ", " + stateCode;

                return new WeatherDataDTO(
                        location,
                        data.get("temp").asDouble(),
                        data.get("app_temp").asDouble(),
                        data.get("rh").asInt(),
                        data.get("wind_spd").asDouble(),
                        data.get("wind_cdir_full").asText(),
                        weather.get("description").asText(),
                        weather.get("code").asInt(),
                        weather.get("icon").asText(),
                        data.get("precip").asDouble(),
                        data.get("vis").asDouble(),
                        data.get("pres").asDouble(),
                        data.get("uv").asInt(),
                        data.get("aqi").asInt()
                );
            }
        } catch (Exception e) {
            throw e;
        }

        return WeatherDataDTO.createDefault();
    }


    /**
     * @return The name of the API
     */
    @Override
    public String getName() {
        return "weatherapi";
    }
}
