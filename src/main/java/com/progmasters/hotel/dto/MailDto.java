package com.progmasters.hotel.dto;

import com.progmasters.hotel.domain.Mail;

public class MailDto {
    private String email;
    private String password;

    public MailDto() {
    }

    public MailDto(Mail mail) {
        this.email = mail.getEmail();
        this.password = mail.getPassword();
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

