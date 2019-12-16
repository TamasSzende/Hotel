package com.progmasters.hotel.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class RoomForm {

    @NotNull(message = "Room name must not be empty")
    @Size(min = 1, max = 200, message = "Room name must be between 1 and 200 characters")
    private String name;

    @NotNull(message = "Number of beds must be between 1 and 50")
    @Min(value = 1, message = "Number of beds must be between 1 and 50")
    @Max(value = 50, message = "Number of beds must be between 1 and 50")
    private Integer numberOfBeds;

    @NotNull(message = "Price must be between 1 and 1000000")
    @Min(value = 1, message = "Price must be between 1 and 1000000")
    @Max(value = 1000000, message = "Price must be between 1 and 1000000")
    private Integer pricePerNight;

    private String description;
    private String imageUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNumberOfBeds() {
        return numberOfBeds;
    }

    public void setNumberOfBeds(Integer numberOfBeds) {
        this.numberOfBeds = numberOfBeds;
    }

    public Integer getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Integer pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
