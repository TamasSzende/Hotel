package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.domain.RoomReservation;
import com.progmasters.hotel.repository.RoomReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class RoomReservationService {

    private RoomReservationRepository roomReservationRepository;

    public RoomReservationService(RoomReservationRepository roomReservationRepository) {
        this.roomReservationRepository = roomReservationRepository;
    }

    public boolean isRoomFree(Long roomId, LocalDate startDate, LocalDate enDate) {
        List<RoomReservation> roomReservations =
                this.roomReservationRepository.findAllByRoomIdAndEndDateAfterAndStartDateBefore(roomId, startDate, enDate);
        return roomReservations.isEmpty();
    }

    public List<Room> findAllOccupiedRoomIdByDateRange(LocalDate startDate, LocalDate endDate) {
        return this.roomReservationRepository.findAllOccupiedRoomIdByDateRange(startDate, endDate);
    }


}
