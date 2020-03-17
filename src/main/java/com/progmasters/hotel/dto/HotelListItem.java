package com.progmasters.hotel.dto;

import com.progmasters.hotel.domain.Hotel;

public class HotelListItem {

    private static final int SHORTDESCRIPTIONLENGTH = 200;

    private Long id;
    private String name;
    private String postalCode;
    private String city;
    private String streetAddress;
    private String hotelType;
    private String hotelImageUrl;
    private String shortDescription;

    HotelListItem() {
    }

    public HotelListItem(Hotel hotel) {
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.postalCode = hotel.getPostalCode();
        this.city = hotel.getCity();
        this.streetAddress = hotel.getStreetAddress();
        this.hotelType = hotel.getHotelType().getDisplayName();
        this.hotelImageUrl = hotel.getHotelImageUrls().get(0);

        if (hotel.getDescription() != null && hotel.getDescription().length() > SHORTDESCRIPTIONLENGTH) {
            String hotelFullDescription = hotel.getDescription();
            String endOfTheDescription = (hotelFullDescription.substring(SHORTDESCRIPTIONLENGTH).split(" "))[0] + "...";
            this.shortDescription = hotelFullDescription.substring(0, SHORTDESCRIPTIONLENGTH) + endOfTheDescription;
        } else {
            this.shortDescription = hotel.getDescription();
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCity() {
        return city;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public String getHotelType() {
        return hotelType;
    }

    public String getHotelImageUrl() {
        return hotelImageUrl;
    }

    public String getShortDescription() {
        return shortDescription;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public void setHotelType(String hotelType) {
        this.hotelType = hotelType;
    }

    public void setHotelImageUrl(String hotelImageUrl) {
        this.hotelImageUrl = hotelImageUrl;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }


}
