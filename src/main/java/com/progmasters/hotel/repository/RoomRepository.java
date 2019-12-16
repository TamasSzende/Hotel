package com.progmasters.hotel.repository;

import com.progmasters.hotel.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by szfilep.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
