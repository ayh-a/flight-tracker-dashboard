package com.ayh.DashboardAPI.service;

import org.opensky.api.OpenSkyApi;
import org.opensky.model.OpenSkyStates;
import org.opensky.model.StateVector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class OpenSkyApiService implements ApiService {
    private final OpenSkyApi api;

    public OpenSkyApiService(@Value("${apis.opensky.username}") String username,
                             @Value("${apis.opensky.password}") String password) {
        api = new OpenSkyApi(username, password);
    }

    /**
     * @return List of global state vectors
     * @throws IOException if there was a http error
     */
    public List<StateVector> getAllStates() throws IOException {
        // get all current state vectors
        try {
            OpenSkyStates states = api.getStates(0, null);

            if (states == null) {
                return Collections.emptyList();
            }

            List<StateVector> stateList = (List<StateVector>) states.getStates();

            return stateList != null ? stateList : Collections.emptyList();
        } catch (Exception e) {
            throw e;
        }


//        return states.getStates().stream().toList();
    }

//    public Object GetAllStatesInBoundingBox() {
//      TODO: implement
//    }

    @Override
    public String getName() {
        return "opensky";
    }
}
