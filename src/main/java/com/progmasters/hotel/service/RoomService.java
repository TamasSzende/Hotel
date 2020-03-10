package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Hotel;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomFeatureType;
import com.progmasters.hotel.domain.RoomType;
import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.repository.HotelRepository;
import com.progmasters.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private RoomRepository roomRepository;
    private HotelRepository hotelRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<RoomFeatureTypeOption> getRoomFeatureTypeOptionList() {
        return Arrays.stream(RoomFeatureType.values()).map(RoomFeatureTypeOption::new).collect(Collectors.toList());
    }

    public List<RoomTypeOption> getRoomTypeOptionList() {
        return Arrays.stream(RoomType.values()).map(RoomTypeOption::new).collect(Collectors.toList());
    }

    public boolean createRoomInHotel(RoomCreateItem roomCreateItem) {
        boolean result = false;
        Room room = new Room(roomCreateItem);
        Long hotelId = roomCreateItem.getHotelId();
        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);
        if (optionalHotel.isPresent()) {
            Hotel hotel = optionalHotel.get();
            room.setHotel(hotel);
            roomRepository.save(room);
            result = true;
        }
        return result;
    }

    public List<RoomListItem> getRoomList(Long hotelId) {
        return roomRepository.findAllByHotel_Id(hotelId)
                .stream()
                .map(RoomListItem::new)
                .collect(Collectors.toList());
    }


    public RoomDetails getRoomDetails(Long roomId) {
        RoomDetails roomDetails = new RoomDetails();
        Optional<Room> optionalRoom = roomRepository.findById(roomId);
        if (optionalRoom.isPresent()) {
            roomDetails = new RoomDetails(optionalRoom.get());
        } else {
            throw new IllegalArgumentException("There is no Room for this id:" + roomId);
        }
        return roomDetails;
    }

    public boolean deleteRoom(Long id) {
        Optional<Room> roomOptional = roomRepository.findById(id);
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            //TODO megnézni máshol is van-e.... pl.RoomReservation
            roomRepository.delete(room);
            return true;
        } else {
            return false;
        }
    }

    public RoomCreateItem getRoomCreateItem(Long id) {
        RoomCreateItem roomCreateItem = null;
        Optional<Room> roomOptional = roomRepository.findById(id);
        if (roomOptional.isPresent()) {
            roomCreateItem = new RoomCreateItem(roomOptional.get());
        }
        return roomCreateItem;
    }

    public boolean updateRoom(RoomCreateItem roomCreateItem, Long id) {
        Optional<Room> roomOptional = roomRepository.findById(id);
        if (roomOptional.isPresent()) {
            Room room = new Room(roomCreateItem);

            room.setId(id);
            Long hotelId = roomCreateItem.getHotelId();
            Optional<Hotel> hotelOptional = this.hotelRepository.findById(hotelId);
            if (hotelOptional.isPresent()) {
                Hotel hotel = hotelOptional.get();
                room.setHotel(hotel);
            }

            this.roomRepository.save(room);
            return true;
        } else {
            return false;
        }
    }

    public Long getHotelIdByRoomId(Long id) {
        Optional<Room> roomOptional = roomRepository.findById(id);
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            Long hotelId = room.getHotel().getId();
            return hotelId;
        } else {
            return null; //TODO ez jó kérdés, hogy itt mivel kellene visszatérni...
        }
    }

}
