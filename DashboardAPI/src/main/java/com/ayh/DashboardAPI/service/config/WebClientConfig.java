package com.ayh.DashboardAPI.service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient weatherWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl("https://api.weatherbit.io/v2.0/current")
                .build();
    }
}
