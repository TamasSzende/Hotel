package com.progmasters.hotel.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final Log log = LogFactory.getLog(this.getClass());
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String MESSAGE_FROM;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendMessage(String email) {
        SimpleMailMessage message = null;
        try {
            message = new SimpleMailMessage();
            message.setFrom(MESSAGE_FROM);
            message.setTo(email);
            System.out.println(email);
            message.setSubject("Sikeres regisztrálás");
            message.setText("Kedves " + email + "! \n \n Köszönjük, hogy regisztráltál az oldalunkra!");
            javaMailSender.send(message);

        } catch (Exception e) {
            log.error("Hiba e-mail küldéskor az alábbi címre: " + email + " " + e);
        }
    }
}
