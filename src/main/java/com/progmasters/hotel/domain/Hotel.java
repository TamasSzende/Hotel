package com.progmasters.hotel.domain;

import com.progmasters.hotel.dto.HotelCreateItem;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "hotel")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city")
    private String city;

    @Column(name = "street_address")
    private String streetAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "hotel_type")
    private HotelType hotelType;

    @OneToMany(mappedBy = "hotel")//, fetch = FetchType.EAGER
    private List<Room> rooms = new ArrayList<>();

    @Column(name = "hotel_image_url")
    private String hotelImageUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = HotelFeatureType.class) //, fetch = FetchType.EAGER
    @CollectionTable(name = "hotel_features")
    @Column(name = "hotel_features")
    private List<HotelFeatureType> hotelFeatures = new ArrayList<>();

    Hotel() {
    }

    public Hotel(String name, String postalCode, String city, String streetAddress, HotelType hotelType, List<Room> rooms, String hotelImageUrl, String description, List<HotelFeatureType> hotelFeatures) {
        this.name = name;
        this.postalCode = postalCode;
        this.city = city;
        this.streetAddress = streetAddress;
        this.hotelType = hotelType;
        this.rooms = rooms;
        this.hotelImageUrl = hotelImageUrl;
        this.description = description;
        this.hotelFeatures = hotelFeatures;
    }

    public Hotel(HotelCreateItem hotelCreateItem) {
        this.name = hotelCreateItem.getName();
        this.postalCode = hotelCreateItem.getPostalCode();
        this.city = hotelCreateItem.getCity();
        this.streetAddress = hotelCreateItem.getStreetAddress();
        this.hotelType = HotelType.valueOf(hotelCreateItem.getHotelType());
        this.hotelImageUrl = hotelCreateItem.getHotelImageUrl();
        this.description = hotelCreateItem.getDescription();
        this.hotelFeatures = hotelCreateItem.getHotelFeatures().stream().map(HotelFeatureType::valueOf).collect(Collectors.toList());
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

    public HotelType getHotelType() {
        return hotelType;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public String getHotelImageUrl() {
        return hotelImageUrl;
    }

    public String getDescription() {
        return description;
    }

    public List<HotelFeatureType> getHotelFeatures() {
        return hotelFeatures;
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

    public void setHotelType(HotelType hotelType) {
        this.hotelType = hotelType;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public void setHotelImageUrl(String hotelImageUrl) {
        this.hotelImageUrl = hotelImageUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setHotelFeatures(List<HotelFeatureType> hotelFeatures) {
        this.hotelFeatures = hotelFeatures;
    }


}
