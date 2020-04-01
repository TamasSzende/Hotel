package com.progmasters.hotel.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progmasters.hotel.domain.HotelFeatureType;
import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.service.HotelService;
import com.progmasters.hotel.service.RoomReservationService;
import com.progmasters.hotel.service.RoomService;
import com.progmasters.hotel.validator.HotelCreateItemValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotel")
public class HotelController {

	private static final int NUM_OF_ELEMENTS_PER_PAGE = 10;

	private HotelService hotelService;
	private RoomReservationService roomReservationService;
	private RoomService roomService;
	private HotelCreateItemValidator validator;

    @Autowired
	public HotelController(HotelService hotelService, RoomReservationService roomReservationService, RoomService roomService, HotelCreateItemValidator validator) {
		this.hotelService = hotelService;
		this.roomReservationService = roomReservationService;
		this.roomService = roomService;
		this.validator = validator;
    }

    @InitBinder("HotelCreateItem")
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

	@GetMapping("/formData")
	public ResponseEntity<HotelFormData> getHotelFormData() {
		List<HotelTypeOption> hotelTypeOptionList = this.hotelService.getHotelTypeOptionList();
		List<HotelFeatureTypeOption> hotelFeatureTypeOptionList = this.hotelService.getHotelFeatureTypeOptionList();
		HotelFormData hotelFormData = new HotelFormData(hotelTypeOptionList, hotelFeatureTypeOptionList);
		return new ResponseEntity<>(hotelFormData, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Long> saveHotel(@Valid @RequestBody HotelCreateItem hotelCreateItem) {
		Long hotelId = hotelService.saveHotel(hotelCreateItem);
		return new ResponseEntity<>(hotelId, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<HotelListItemSubList> getHotelList(@RequestParam(required = false) Integer listPageNumber) {
		if (listPageNumber == null) listPageNumber = 0;
		return new ResponseEntity<>(hotelService.getPageOfHotelListOrderByBestPrice(listPageNumber, NUM_OF_ELEMENTS_PER_PAGE), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<HotelDetailItem> getHotel(@PathVariable Long id) {
		return new ResponseEntity<>(hotelService.getHotelDetailItem(id), HttpStatus.OK);
	}

	@GetMapping("/filter")
	public ResponseEntity<HotelListItemSubList> getFilteredHotelList(
			@RequestParam("startDate") @JsonFormat(pattern = "yyyy. MM. dd.") LocalDate startDate,
			@RequestParam("endDate") @JsonFormat(pattern = "yyyy. MM. dd.") LocalDate endDate,
			@RequestParam("numberOfGuests") long numberOfGuests,
			@RequestParam List<String> hotelFeatures,
			@RequestParam(required = false) Integer listPageNumber) {
		if (listPageNumber == null) listPageNumber = 0;
		HotelListItemSubList hotelList;
		if (hotelFeatures.isEmpty()) {
			hotelList = hotelService.getPageOfHotelListFilteredByDateAndPerson(startDate, endDate, numberOfGuests, listPageNumber, NUM_OF_ELEMENTS_PER_PAGE);
		} else {
			List<HotelFeatureType> hotelFeatureEnumList = hotelFeatures.stream().map(HotelFeatureType::valueOf).collect(Collectors.toList());
			hotelList = hotelService.getPageOfHotelListFilteredByDatePersonAndFeatures(startDate, endDate, numberOfGuests, hotelFeatureEnumList, listPageNumber, NUM_OF_ELEMENTS_PER_PAGE);
		}
		return new ResponseEntity<>(hotelList, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<List<HotelListItem>> deleteHotel(@PathVariable Long id) {
		boolean isDeleteSuccessful = hotelService.deleteHotel(id);
 		ResponseEntity<List<HotelListItem>> result;
		if (isDeleteSuccessful) {
			result = new ResponseEntity<>(hotelService.getHotelListItemList(), HttpStatus.OK);
		} else {
			result = new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
 		return result;
	}

	@GetMapping("/formData/{id}")
	public ResponseEntity<HotelCreateItem> getHotelForUpdate(@PathVariable(name = "id") Long id) {
		return new ResponseEntity<>(hotelService.getHotelCreateItem(id), HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<HotelCreateItem> updateHotel(@Valid @RequestBody HotelCreateItem hotelCreateItem, @PathVariable Long id) {
		boolean hotelIsUpdated = hotelService.updateHotel(hotelCreateItem, id);
		return hotelIsUpdated ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@PostMapping("/uploadImage/{id}")
	public ResponseEntity<Void> uploadHotelImage(@RequestParam MultipartFile file, @PathVariable Long id) {
		hotelService.saveHotelImage(file, id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/deleteImage/{id}")
	public ResponseEntity<Void> deleteImageFromHotel(@RequestParam String imageURL,@PathVariable Long id){
    	hotelService.deleteHotelImage(imageURL,id);
    	return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/images/{id}")
	public ResponseEntity<List<String>> getHotelImages(@PathVariable Long id){
		List<String> imageURLs = hotelService.getHotelImages(id);
		return new ResponseEntity<>(imageURLs,HttpStatus.OK);
	}

}
