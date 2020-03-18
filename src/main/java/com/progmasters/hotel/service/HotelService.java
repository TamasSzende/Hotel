package com.progmasters.hotel.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.progmasters.hotel.domain.Hotel;
import com.progmasters.hotel.domain.HotelFeatureType;
import com.progmasters.hotel.domain.HotelType;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.repository.HotelRepository;
import com.progmasters.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.header.Header;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.function.ServerRequest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelService {

	private static Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
			"cloud_name", "doaywchwk",
			"api_key", "115312357113411",
			"api_secret", "rvKG8MW45AZWCh66Xs4oaxt4Bpk"
	));

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

	public Long saveHotel(HotelCreateItem hotelCreateItem) {
		Hotel hotel = new Hotel(hotelCreateItem);
		this.hotelRepository.save(hotel);
        return hotel.getId();
	}

	public HotelDetailItem getHotelDetailItem(Long hotelId) {
		HotelDetailItem hotelDetailItem = null;
		Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
		if (hotelOptional.isPresent()) {
			hotelDetailItem = new HotelDetailItem(hotelOptional.get());
			List<RoomListItem> rooms = roomRepository.findAllByHotelId(hotelId)
					.stream()
					.map(RoomListItem::new)
					.collect(Collectors.toList());
			hotelDetailItem.setRooms(rooms);
		}
		return hotelDetailItem;
	}

	public HotelShortItem getHotelShortItem(Long id) {
		HotelShortItem hotelShortItem = null;
		Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			hotelShortItem = new HotelShortItem(hotelOptional.get());
		}
		return hotelShortItem;
	}

	public HotelCreateItem getHotelCreateItem (Long id) {
		HotelCreateItem hotelCreateItem = null;
		 Optional<Hotel> hotelOptional = hotelRepository.findById(id);
		if (hotelOptional.isPresent()) {
			hotelCreateItem = new HotelCreateItem(hotelOptional.get());
		}
		return hotelCreateItem;
	}

	public boolean updateHotel(HotelCreateItem hotelCreateItem, Long id) {
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
			List<Room> deletedRooms = hotel.getRooms();
			for (Room deletedRoom : deletedRooms) {
				this.roomRepository.delete(deletedRoom);
			}
			hotelRepository.delete(hotel);
			return true;
		} else {
			return false;
		}
	}

	public String saveHotelImage(Path path, Long id) {
		String imageURL = "";
		try  {
			imageURL = uploadImage(path.toFile());
			if (hotelRepository.findById(id).isPresent()) {
				hotelRepository.findById(id).get().getHotelImageUrls().add(imageURL);
			}
			Files.delete(path);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return imageURL;
	}

	private String uploadImage(File file){
		String url = null;
		try {
			Map uploadResult = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
			url = uploadResult.get("url").toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return url;
	}

	public void deleteHotelImage(String imageURL, Long id){
		if (hotelRepository.findById(id).isPresent()) {
			hotelRepository.findById(id).get().getHotelImageUrls().remove(imageURL);
			try {
				cloudinary.uploader().destroy(imageURL.substring(61,imageURL.length()-4),ObjectUtils.emptyMap());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
