package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.RoomDetails;
import com.progmasters.hotel.dto.RoomForm;
import com.progmasters.hotel.dto.RoomListItem;
import com.progmasters.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by szfilep.
 */
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private HotelService hotelService;

    @Autowired
    public RoomController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<RoomListItem> rooms() {
        return hotelService.getRoomList();
    }

    @GetMapping("/{id}")
    public RoomDetails roomDetail(@PathVariable("id") Long id) {
        return hotelService.getRoomDetails(id);
    }

    @PostMapping
    public ResponseEntity createRoom(@RequestBody @Valid RoomForm roomForm) {
        hotelService.createRoom(roomForm);
        return new ResponseEntity(HttpStatus.CREATED);
    }

}
