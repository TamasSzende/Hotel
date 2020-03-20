package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE r.room.id = :room_id ")
    List<Booking> findAllByRoomId(@Param("room_id") Long roomId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE r.room.id = :room_id " +
            "AND r.startDate <= current_date AND r.endDate >= current_date " +
            "ORDER BY r.startDate")
    List<Booking> findCurrentByRoomId(@Param("room_id") Long roomId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE r.room.id = :room_id " +
            "AND r.startDate > current_date " +
            "ORDER BY r.startDate")
    List<Booking> findFutureByRoomId(@Param("room_id") Long roomId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE r.room.id = :room_id " +
            "AND r.endDate < current_date " +
            "ORDER BY r.startDate DESC")
    List<Booking> findPastByRoomId(@Param("room_id") Long roomId);


    @Query("SELECT b FROM Booking b WHERE b.guest.id = :user_id")
    List<Booking> findAllByUserId(@Param("user_id") Long userId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE b.guest.id = :user_id " +
            "AND r.startDate <= current_date AND r.endDate >= current_date " +
            "ORDER BY r.startDate")
    List<Booking> findCurrentByUserId(@Param("user_id") Long userId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE b.guest.id = :user_id " +
            "AND r.startDate > current_date " +
            "ORDER BY r.startDate")
    List<Booking> findFutureByUserId(@Param("user_id") Long userId);

    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE b.guest.id = :user_id " +
            "AND r.endDate < current_date " +
            "ORDER BY r.startDate DESC")
    List<Booking> findPastByUserId(@Param("user_id") Long userId);


    @Query("SELECT b FROM Booking b JOIN b.roomReservations reservations JOIN reservations.room room JOIN room.hotel hotel WHERE hotel.id = :hotel_id ")
    List<Booking> findAllByHotelId(@Param("hotel_id") Long hotelId);


}
