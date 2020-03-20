package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingDetails;
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

    @GetMapping("/{id}")
    public BookingDetails bookingDetail(@PathVariable("id") Long id) {
        return bookingService.getBookingDetails(id);
    }

    @GetMapping
    public ResponseEntity<List<BookingListItem>> getBookingList() {
        return new ResponseEntity<>(bookingService.getBookingListItemList(), HttpStatus.OK);
    }

    @GetMapping("room/{id}")
    public ResponseEntity<List<BookingListItem>> getBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/current/{id}")
    public ResponseEntity<List<BookingListItem>> getCurrentBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getCurrentBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/future/{id}")
    public ResponseEntity<List<BookingListItem>> getFutureBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getFutureBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/past/{id}")
    public ResponseEntity<List<BookingListItem>> getPastBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getPastBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<List<BookingListItem>> getBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/current/{id}")
    public ResponseEntity<List<BookingListItem>> getCurrentBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getCurrentBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/future/{id}")
    public ResponseEntity<List<BookingListItem>> getFutureBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getFutureBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/past/{id}")
    public ResponseEntity<List<BookingListItem>> getPastBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getPastBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("hotel/{id}")
    public ResponseEntity<List<BookingListItem>> getBookingListByHotel(@PathVariable("id") Long hotelId) {
        return new ResponseEntity<>(bookingService.getBookingListByHotel(hotelId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Long> saveBooking(@RequestBody BookingCreateItem bookingCreateItem) {
        Long bookingId = bookingService.saveBooking(bookingCreateItem);
        return bookingId != null ?
                new ResponseEntity<>(bookingId, HttpStatus.CREATED) :
                new ResponseEntity<>(HttpStatus.FAILED_DEPENDENCY);
    }

}
