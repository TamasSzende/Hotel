package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h from Hotel h WHERE h.name = :name")
    Optional<Object> findByHotelName(String name);
}
