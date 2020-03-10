package com.progmasters.hotel.domain;

public enum HotelFeatureType {

    PARKOLASILEHETOSEG("Ingyenes parkolás"),
    AZONNALIVISSZAIGAZOLAS("Azonnali visszaigazolás"),
    INGYENESWIFI("Ingyenes WIFI"),
    OTP_MKB_KARTYA("OTP, MKB (Szabadidő, Vendéglátás, Szálláshely)"),
    OTP_MKB_KANDH_KARTYA("OTP, MKB, K&H (Szabadidő, Vendéglátás, Szálláshely)"),
    HATEVES_KORIG_INGYENES("6 éves korig ingyenes"),
    BABABARAT_HAROMEVES_KORIG_INGYENES("Bababarát szálláshely (3 éves korig ingyenes)"),
    BABABARAT("Bababarát szálláshely"),
    PARKOLAS_FIZETOS("Parkolási lehetőség (Fizetős)"),
    INGYENES_LEGKONDICIONALAS("Ingyenes Légkondícionálás"),
    LEGKONDICIONALAS("Légkondícionálás"),
    WELLNESS("Wellness szolgáltatások"),
    ETTEREM("Saját étterem"),
    ;

    private String displayName;

    HotelFeatureType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}