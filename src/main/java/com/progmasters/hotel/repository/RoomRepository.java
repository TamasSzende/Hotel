package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomFeatureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r JOIN r.hotel h WHERE h.id = :hotel_id ORDER BY r.pricePerNight")
    List<Room> findAllByHotelId(@Param("hotel_id") Long hotelId);

    @Query("SELECT r FROM Room r JOIN r.hotel h JOIN r.roomFeatures f WHERE h.id = :hotel_id AND f IN :room_features GROUP BY r HAVING COUNT(r) = :count_of_matches ORDER BY r.pricePerNight")
    List<Room> findAllByHotelIdByRoomFeatures(@Param("hotel_id") Long hotelId, @Param("room_features") List<RoomFeatureType> roomFeatures, @Param("count_of_matches") Long countOfMatches);


    List<Room> findAllByHotelIdOrderByPricePerNight(Long hotelId);
}
