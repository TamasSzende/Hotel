package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.dto.RoomDetails;
import com.progmasters.hotel.dto.RoomForm;
import com.progmasters.hotel.dto.RoomListItem;
import com.progmasters.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Created by szfilep.
 */
@Service
public class HotelService {

    private RoomRepository roomRepository;

    @Autowired
    public HotelService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomListItem> getRoomList() {
        List<RoomListItem> roomListItems = new ArrayList<>();
        List<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            RoomListItem item = new RoomListItem();
            updateRoomListItemValues(item, room);
            roomListItems.add(item);
        }
        return roomListItems;
    }

    public void createRoom(RoomForm roomForm) {
        roomRepository.save(new Room(roomForm));
    }

    public RoomDetails getRoomDetails(Long roomId) {
        RoomDetails roomDetails = new RoomDetails();

        Optional<Room> room = roomRepository.findById(roomId);
        if (room.isPresent()) {
            roomDetails.setId(room.get().getId());
            roomDetails.setName(room.get().getName());
            roomDetails.setNumberOfBeds(room.get().getNumberOfBeds());
            roomDetails.setPricePerNight(room.get().getPricePerNight());
            roomDetails.setDescription(room.get().getDescription());
            roomDetails.setImageUrl(room.get().getImageUrl());
        } else {
            throw new IllegalArgumentException("There is no Room for this id:" + roomId);
        }
        return roomDetails;
    }

    private void updateRoomListItemValues(RoomListItem item, Room room) {
        item.setId(room.getId());
        item.setName(room.getName());
        item.setNumberOfBeds(room.getNumberOfBeds());
        item.setPricePerNight(room.getPricePerNight());
        item.setImageUrl(room.getImageUrl());
    }
}
