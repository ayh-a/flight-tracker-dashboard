package com.ayh.DashboardAPI.service;

import org.opensky.api.OpenSkyApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenSkyApiService implements ApiService {
//    @Value("${apis.opensky.username}")
//    private String username;

//    @Value("${apis.opensky.password}")
//    private String password;

    private final OpenSkyApi api;

    public OpenSkyApiService(@Value("${apis.opensky.username}") String username,
                             @Value("${apis.opensky.password}") String password) {
        api = new OpenSkyApi(username, password);
    }

//    public Object getAllStates() {
//      TODO: implement
//    }

//    public Object GetAllStatesInBoundingBox() {
//      TODO: implement
//    }

    @Override
    public String getName() {
        return "opensky";
    }
}
