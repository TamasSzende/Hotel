package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.RoomReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomReservationRepository extends JpaRepository<RoomReservation, Long> {

}
