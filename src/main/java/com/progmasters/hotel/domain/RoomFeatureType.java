package com.progmasters.hotel.domain;

public enum RoomFeatureType {

	TEAKAVEFOZO("Tea-/ kávéfőző"),
	HAJSZARITO("Hajszárító"),
	HUTOSZEKRENY("Hűtőszekrény"),
	TV("TV"),
	BABAAGY("Babaágy"),
	MINIBAR("Minibár"),
	SZOBASZEF("Szobaszéf"),
	LEGKONDICIONALT("Légkondicionált"),
	ERKELYTERASZ("Erkély / Terasz"),
    ;

    private String displayName;

    private RoomFeatureType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}