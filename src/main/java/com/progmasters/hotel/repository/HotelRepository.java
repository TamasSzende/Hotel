package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {


}
