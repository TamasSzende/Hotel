package com.progmasters.hotel;

import com.progmasters.hotel.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class AngularHotelApplication {
    //----- GENERATE DEFAULT ADMIN, USER, HOTELOWNER ------

    private AccountService accountService;

    @Autowired
    public AngularHotelApplication(AccountService accountService) {
        this.accountService = accountService;
    }

    @EventListener
    public void seed(ContextRefreshedEvent event) {
        accountService.checkAdmin();
        accountService.checkUser();
        accountService.checkHotelOwner();
    }


    public static void main(String[] args) {
        SpringApplication.run(AngularHotelApplication.class, args);
    }

}
