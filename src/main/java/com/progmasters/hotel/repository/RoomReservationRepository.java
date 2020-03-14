package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.RoomReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomReservationRepository extends JpaRepository<RoomReservation, Long> {

    List<RoomReservation> findAllByRoomIdAndEndDateAfterAndStartDateBefore(Long roomId, LocalDate startDate, LocalDate endDate);

//    @Query("SELECT r FROM RoomReservation r WHERE r.id = :roomId AND r.endDate > :starDate AND r.startDate < :endDate")
//    List<RoomReservation> findAllByRoomIdAndDateRange(@Param("roomId") Long roomId,
//                                                      @Param("startDate") LocalDate startDate,
//                                                      @Param("endDate") LocalDate endDate);

}
