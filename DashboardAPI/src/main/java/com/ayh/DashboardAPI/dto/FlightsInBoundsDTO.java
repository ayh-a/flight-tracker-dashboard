package com.ayh.DashboardAPI.dto;

import org.opensky.model.StateVector;

import java.util.List;

public record FlightsInBoundsDTO(List<StateVector> flights) {
}
