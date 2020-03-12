package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingListItem;
import com.progmasters.hotel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    private BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingListItem>> getBookingList() {
        return new ResponseEntity<>(bookingService.getBookingListItemList(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> saveBooking(@RequestBody BookingCreateItem bookingCreateItem) {
        boolean bookingIsCreated = bookingService.saveBooking(bookingCreateItem);
        return bookingIsCreated ? new ResponseEntity<>(HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.FAILED_DEPENDENCY);
    }

}
