package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.BookingCreateItem;
import com.progmasters.hotel.dto.BookingDetails;
import com.progmasters.hotel.dto.BookingListItemForHotel;
import com.progmasters.hotel.dto.BookingListItemForUser;
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

    @PostMapping
    public ResponseEntity<Long> saveBooking(@RequestBody BookingCreateItem bookingCreateItem) {
        Long bookingId = bookingService.saveBooking(bookingCreateItem);
        return bookingId != null ?
                new ResponseEntity<>(bookingId, HttpStatus.CREATED) :
                new ResponseEntity<>(HttpStatus.FAILED_DEPENDENCY);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long bookingId) {
        boolean isDeleteSuccessful = bookingService.deleteBooking(bookingId);
        return isDeleteSuccessful ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public BookingDetails bookingDetail(@PathVariable("id") Long id) {
        return bookingService.getBookingDetails(id);
    }

    @GetMapping("room/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/current/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getCurrentBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getCurrentBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/future/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getFutureBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getFutureBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("room/past/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getPastBookingListByRoom(@PathVariable("id") Long roomId) {
        return new ResponseEntity<>(bookingService.getPastBookingListByRoom(roomId), HttpStatus.OK);
    }

    @GetMapping("hotel/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getBookingListByHotel(@PathVariable("id") Long hotelId) {
        return new ResponseEntity<>(bookingService.getBookingListByHotel(hotelId), HttpStatus.OK);
    }

    @GetMapping("hotel/current/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getCurrentBookingListByHotel(@PathVariable("id") Long hotelId) {
        return new ResponseEntity<>(bookingService.getCurrentBookingListByHotel(hotelId), HttpStatus.OK);
    }

    @GetMapping("hotel/future/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getFutureBookingListByHotel(@PathVariable("id") Long hotelId) {
        return new ResponseEntity<>(bookingService.getFutureBookingListByHotel(hotelId), HttpStatus.OK);
    }

    @GetMapping("hotel/past/{id}")
    public ResponseEntity<List<BookingListItemForHotel>> getPastBookingListByHotel(@PathVariable("id") Long hotelId) {
        return new ResponseEntity<>(bookingService.getPastBookingListByHotel(hotelId), HttpStatus.OK);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<List<BookingListItemForUser>> getBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/current/{id}")
    public ResponseEntity<List<BookingListItemForUser>> getCurrentBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getCurrentBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/future/{id}")
    public ResponseEntity<List<BookingListItemForUser>> getFutureBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getFutureBookingListByUser(userId), HttpStatus.OK);
    }

    @GetMapping("user/past/{id}")
    public ResponseEntity<List<BookingListItemForUser>> getPastBookingListByUser(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(bookingService.getPastBookingListByUser(userId), HttpStatus.OK);
    }

}
