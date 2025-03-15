package com.ayh.DashboardAPI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenSkyApiService implements ApiService {
    @Value("${apis.opensky.username}")
    private String username;

    @Value("${apis.opensky.password}")
    private String password;

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
