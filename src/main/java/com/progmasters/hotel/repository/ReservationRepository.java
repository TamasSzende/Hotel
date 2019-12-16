package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by szfilep.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

}
