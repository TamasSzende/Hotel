package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//    @Query("SELECT b FROM Booking b JOIN b.roomReservations r WHERE :room IN r")
//    List<Booking> findAllActualByRoomId(@Param("room") Room room);

}
