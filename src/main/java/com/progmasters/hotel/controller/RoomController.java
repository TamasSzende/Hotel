package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/formData")
    public ResponseEntity<RoomFormData> getRoomFormData() {
        List<RoomTypeOption> roomTypeOptionList = this.roomService.getRoomTypeOptionList();
        List<RoomFeatureTypeOption> roomFeatureTypeOptionList = this.roomService.getRoomFeatureTypeOptionList();
        RoomFormData roomFormData = new RoomFormData(roomTypeOptionList, roomFeatureTypeOptionList);
        return new ResponseEntity<>(roomFormData, HttpStatus.OK);
    }

    @GetMapping
    public List<RoomListItem> rooms() {
        return roomService.getRoomList();
    }

    @GetMapping("/{id}")
    public RoomDetails roomDetail(@PathVariable("id") Long id) {
        return roomService.getRoomDetails(id);
    }

    @PostMapping
    public ResponseEntity createRoom(@RequestBody @Valid RoomCreateItem roomCreateItem) {
        roomService.createRoom(roomCreateItem);
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @PostMapping("/{id}")
    public ResponseEntity createRoomInHotel(@RequestBody @Valid RoomCreateItem roomCreateItem, @PathVariable Long id) {
        boolean roomIsCreated = roomService.createRoomInHotel(roomCreateItem, id);
        return roomIsCreated ? new ResponseEntity<>(HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.FAILED_DEPENDENCY);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<RoomListItem>> deleteRoom(@PathVariable Long id) {
        boolean isDeleteSuccessful = roomService.deleteRoom(id);
        ResponseEntity<List<RoomListItem>> result;
        if (isDeleteSuccessful) {
            result = new ResponseEntity<>(roomService.getRoomList(), HttpStatus.OK);
        } else {
            result = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @GetMapping("/formData/{id}")
    public ResponseEntity<RoomCreateItem> getRoomForUpdate(@PathVariable(name = "id") Long id) {
        return new ResponseEntity<>(roomService.getRoomCreateItem(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomCreateItem> updateRoom(@Valid @RequestBody RoomCreateItem roomCreateItem, @PathVariable Long id) {
        Boolean roomIsUpdated = roomService.updateRoom(roomCreateItem, id);
        return roomIsUpdated ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


}
