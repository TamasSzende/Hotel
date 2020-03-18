package com.progmasters.hotel.controller;

import com.progmasters.hotel.dto.RegistrationDetails;
import com.progmasters.hotel.service.AccountService;
import com.progmasters.hotel.validator.RegistrationValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class);
    private AccountService accountService;
    private RegistrationValidator registrationValidator;

    @Autowired
    public RegistrationController(AccountService accountService, RegistrationValidator registrationValidator) {
        this.accountService = accountService;
        this.registrationValidator = registrationValidator;
    }

    @InitBinder("registrationDetails")
    protected void initRegistrationBinder(WebDataBinder binder) {
        binder.addValidators(registrationValidator);
    }

    //----------SEND MAIL AND CREATE USER AT REGISTRATION----------

    @PostMapping("/user")
    public ResponseEntity<?> createNewUser(@RequestBody @Valid RegistrationDetails registrationDetails) throws Exception {
        accountService.sendMessage(registrationDetails.getEmail()); //TODO rendbe rakni
        logger.info("New mail added");
        accountService.saveUserRegistration(registrationDetails);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/hotelOwner")
    public ResponseEntity<?> createNewHotelOwner(@RequestBody @Valid RegistrationDetails registrationDetails) throws Exception {
        accountService.sendMessage(registrationDetails.getEmail()); //TODO rendbe rakni
        logger.info("New mail added");
        accountService.saveHotelOwnerRegistration(registrationDetails);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //----------CHECK THE MAIL----------

    @GetMapping("/checkIfEmailIsTaken/{id}/{email}")
    public ResponseEntity<Boolean> checkIfEmailIsTaken(@PathVariable String id, @PathVariable String email) {
        boolean result = accountService.checkIfEmailIsTaken(id, email);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
