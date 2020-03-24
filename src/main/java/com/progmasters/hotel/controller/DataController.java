package com.progmasters.hotel.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.progmasters.hotel.domain.Hotel;
import com.progmasters.hotel.domain.Room;
import com.progmasters.hotel.repository.HotelRepository;
import com.progmasters.hotel.repository.RoomRepository;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Controller
@RequestMapping("/admin/fill-database")
public class DataController {
    private HotelRepository hotelRepository;
    private RoomRepository roomRepository;

    @Autowired
    public DataController(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }


    @GetMapping
    public ResponseEntity<Void> fillDatabase(){
        File file = loadFileFromResources("hotels2.json");
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            List<Hotel> hotelList = objectMapper.readValue(file, new TypeReference<>() {
            });
            for (Hotel hotel : hotelList) {
                if (hotelRepository.findByHotelName(hotel.getName()).isEmpty()) {
                    hotelRepository.save(hotel);
                    for (Room room : hotel.getRooms()) {
                        room.setHotel(hotel);
                        roomRepository.save(room);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    public static File loadFileFromResources(String pathInResources) {
        Resource resource = new ClassPathResource(pathInResources);
        File pdfFile = null;
        try (InputStream inputStream = resource.getInputStream()) {
            pdfFile = File.createTempFile("test", ".txt");
            FileUtils.copyInputStreamToFile(inputStream, pdfFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return pdfFile;
    }
}
