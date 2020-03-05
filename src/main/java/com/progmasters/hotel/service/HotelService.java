package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Hotel;
import com.progmasters.hotel.domain.HotelFeatureType;
import com.progmasters.hotel.domain.HotelType;
import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.repository.HotelRepository;
import com.progmasters.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelService {

	private HotelRepository hotelRepository;
	private RoomRepository roomRepository;

	@Autowired
	public HotelService(RoomRepository roomRepository, HotelRepository hotelRepository) {
		this.hotelRepository = hotelRepository;
		this.roomRepository = roomRepository;
	}

	public List<Hotel> findAllHotel() {
		return hotelRepository.findAll();
	}

	public List<HotelListItem> getHotelListItemList() {
		return findAllHotel().stream().map(HotelListItem::new).collect(Collectors.toList());
	}

	public List<HotelFeatureTypeOption> getHotelFeatureTypeOptionList() {
		return Arrays.stream(HotelFeatureType.values()).map(HotelFeatureTypeOption::new).collect(Collectors.toList());
	}
	public List<HotelTypeOption> getHotelTypeOptionList() {
		return Arrays.stream(HotelType.values()).map(HotelTypeOption::new).collect(Collectors.toList());
	}

	public void saveHotel(HotelCreateItem hotelCreateItem) {
		Hotel hotel = new Hotel(hotelCreateItem);
		this.hotelRepository.save(hotel);
	}

	public HotelDetailItem getHotelDetailItem (Long id) {
		HotelDetailItem hotelDetailItem = null;
		 Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			hotelDetailItem = new HotelDetailItem(hotelOptional.get());
		}
		return hotelDetailItem;
	}

	public HotelCreateItem getHotelCreateItem (Long id) {
		HotelCreateItem hotelCreateItem = null;
		 Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			hotelCreateItem = new HotelCreateItem(hotelOptional.get());
		}
		return hotelCreateItem;
	}

	public Boolean updateHotel(HotelCreateItem hotelCreateItem, Long id) {
		Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			Hotel hotel = new Hotel(hotelCreateItem);

			hotel.setId(id);
			this.hotelRepository.save(hotel);
			return true;
		} else {
			return false;
		}
	}

	public boolean deleteHotel(Long id) {
		Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			Hotel hotel = hotelOptional.get();
            //TODO megnézni máshol van-e...
			hotelRepository.delete(hotel);
			return true;
		} else {
			return false;
		}
	}

}
