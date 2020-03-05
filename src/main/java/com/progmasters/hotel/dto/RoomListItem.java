package com.progmasters.hotel.dto;

import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomFeatureType;

import java.util.ArrayList;
import java.util.List;

public class RoomListItem {

    private Long id;
    private String roomName;
    private String roomType;
    private Integer numberOfBeds;
    private Integer roomArea;
    private Double pricePerNight;
    private String roomImageUrl;
    private String description;
    private List<String> roomFeatures = new ArrayList<>();

    RoomListItem() {
    }

    public RoomListItem(Room room) {
        this.id = room.getId();
        this.roomName = room.getRoomName();
        this.roomType = room.getRoomType().getDisplayName();
        this.numberOfBeds = room.getNumberOfBeds();
        this.roomArea = room.getRoomArea();
        this.pricePerNight = room.getPricePerNight();
        this.roomImageUrl = room.getRoomImageUrl();
        this.description = room.getDescription();
        for (RoomFeatureType roomFeaturesType : room.getRoomFeatures()) {
            this.roomFeatures.add(roomFeaturesType.getDisplayName());
        }
    }

}
