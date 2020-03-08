package com.progmasters.hotel.controller;


import com.progmasters.hotel.dto.MailDto;
import com.progmasters.hotel.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registrations")
public class MailController {

    private static final Logger logger = LoggerFactory.getLogger(MailController.class);
    private EmailService emailService;

    @Autowired
    public MailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity create(@RequestBody MailDto mailDto) {
        emailService.sendMessage(mailDto.getEmail());
        logger.info("New mail added");
        return new ResponseEntity(HttpStatus.CREATED);
    }
}
