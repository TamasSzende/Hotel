package com.progmasters.hotel.controller;

import com.progmasters.hotel.security.AuthenticatedLoginDetails;
import com.progmasters.hotel.service.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);
    private AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //----------GET A USER----------

    @GetMapping("/me")
    public ResponseEntity<AuthenticatedLoginDetails> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails user = (UserDetails) authentication.getPrincipal();

        if (!accountService.accountIsActive(user.getUsername())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            AuthenticatedLoginDetails authenticatedLoginDetails = new AuthenticatedLoginDetails(user);
            String username = authenticatedLoginDetails.getName();
            Long hotelId = this.accountService.findByUsername(username).getHotelId();

            authenticatedLoginDetails.setHotelId(hotelId);
            return new ResponseEntity<>(authenticatedLoginDetails, HttpStatus.OK);
        }
    }
}
