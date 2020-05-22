package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.RoomReservationData;
import com.progmasters.hotel.service.RoomReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roomReservation")
public class RoomReservationController {

    private RoomReservationService roomReservationService;

    public RoomReservationController(RoomReservationService roomReservationService) {
        this.roomReservationService = roomReservationService;
    }

    @PutMapping("/{roomReservationId}")
    public ResponseEntity<Void> updateRoomReservation(@RequestBody RoomReservationData modifiedRoomReservationData, @PathVariable Long roomReservationId) {
        boolean roomReservationIsUpdated = roomReservationService.updateRoomReservation(modifiedRoomReservationData, roomReservationId);
        return roomReservationIsUpdated ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }




}
