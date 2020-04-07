package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Account;
import com.progmasters.hotel.domain.ConfirmationToken;
import com.progmasters.hotel.repository.ConfirmationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String MESSAGE_FROM;

    @Value("${spring.mail.url}")
    private String mailSenderAddress;

    private JavaMailSender javaMailSender;
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    public EmailService(JavaMailSender javaMailSender, ConfirmationTokenRepository confirmationTokenRepository) {
        this.javaMailSender = javaMailSender;
        this.confirmationTokenRepository = confirmationTokenRepository;
    }


    public void sendConfirmationMail(Account account) {
        ConfirmationToken confirmationToken = new ConfirmationToken(account);
        confirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(MESSAGE_FROM);
        message.setTo(account.getEmail());
        message.setSubject("Sikeres Regisztráció!");
        message.setText("Regisztrációd megerősítéséhez kérlek kattints a linkre: "
                + this.mailSenderAddress + "/login/" + confirmationToken.getConfirmationToken());
        javaMailSender.send(message);
    }

    public void sendMailAtBooking(Account account) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(MESSAGE_FROM);
        message.setTo(account.getEmail());
        message.setSubject("Sikeres Foglalás!");
        message.setText("Tisztelt " + account.getUsername() + "!\n\n" + "Foglalásod elmentettük, részletei megtalálhatóak a honlapon");
        javaMailSender.send(message);

    }

    public void sendMailAtDeleteBooking(Account account) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(MESSAGE_FROM);
        message.setTo(account.getEmail());
        message.setSubject("Foglalás Törölve!");
        message.setText("Tisztelt " + account.getUsername() + "!\n\n" + "Foglalásod töröltük az adatbázisból!");
        javaMailSender.send(message);
    }

}
