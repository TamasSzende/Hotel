package com.progmasters.hotel.dto;

import com.progmasters.hotel.domain.Account;

public class AccountDetails {

    private Long id;

    private String email;

    private String password;

    public AccountDetails() {
    }

    public AccountDetails(Account login) {
        this.id = login.getId();
        this.email = login.getEmail();
        this.password = login.getPassword();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
