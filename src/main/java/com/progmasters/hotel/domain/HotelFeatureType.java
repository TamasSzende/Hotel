package com.progmasters.hotel.domain;

public enum HotelFeatureType {

	PARKOLASILEHETOSEG("Parkolási lehetőség"),
	AZONNALIVISSZAIGAZOLAS("Azonnali visszaigazolás"),
	INGYENESWIFI("Ingyenes WIFI"),
	OTPMKBKARTYA("OTP, MKB kártya"),
	HATEVESKORIGINGYENES("6 éves korig ingyenes"),
    ;

    private String displayName;

    private HotelFeatureType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}