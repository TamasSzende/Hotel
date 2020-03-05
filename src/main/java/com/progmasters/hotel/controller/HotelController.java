package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.*;
import com.progmasters.hotel.service.HotelService;
import com.progmasters.hotel.service.RoomService;
import com.progmasters.hotel.validator.HotelCreateItemValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/hotel")
public class HotelController {

	private HotelService hotelService;
	private RoomService roomService;
	private HotelCreateItemValidator validator;

    @Autowired
    public HotelController(HotelService hotelService, RoomService roomService, HotelCreateItemValidator validator) {
		this.hotelService = hotelService;
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
	public ResponseEntity<Void> saveHotel(@Valid @RequestBody HotelCreateItem hotelCreateItem) {
		hotelService.saveHotel(hotelCreateItem);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

	@GetMapping
	public ResponseEntity<List<HotelListItem>> getHotelList() {
		return new ResponseEntity<>(hotelService.getHotelListItemList(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<HotelDetailItem> getHotel(@PathVariable Long id) {
		return new ResponseEntity<>(hotelService.getHotelDetailItem(id), HttpStatus.OK);
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
		Boolean hotelIsUpdated = hotelService.updateHotel(hotelCreateItem, id);
		return hotelIsUpdated ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

}
