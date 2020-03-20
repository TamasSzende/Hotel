package com.progmasters.hotel.service;

import com.progmasters.hotel.domain.Account;
import com.progmasters.hotel.domain.ConfirmationToken;
import com.progmasters.hotel.domain.Role;
import com.progmasters.hotel.dto.RegistrationDetails;
import com.progmasters.hotel.repository.AccountRepository;
import com.progmasters.hotel.repository.ConfirmationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    private static final String ADMINMAIL = "hotel.team.five.a@gmail.com";
    private static final String USERMAIL = "hotel.team.five.u@gmail.com";
    private static final String HOTELOWNERMAIL = "hotel.team.five.h@gmail.com";
    private JavaMailSender javaMailSender;
    private BCryptPasswordEncoder passwordEncoder;
    private AccountRepository accountRepository;
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Value("${spring.mail.username}")
    private String MESSAGE_FROM;

    @Value("${spring.mail.url}")
    private String mailSenderAddress;

    @Autowired
    public AccountService(JavaMailSender javaMailSender, AccountRepository accountRepository, ConfirmationTokenRepository confirmationTokenRepository) {
        this.javaMailSender = javaMailSender;
        this.confirmationTokenRepository = confirmationTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.accountRepository = accountRepository;
    }


    //----------SEND MAIL AT REGISTRATION----------

//    public void sendMessage(String email) {
//        SimpleMailMessage message = null;
//        try {
//            message = new SimpleMailMessage();
//            message.setFrom(MESSAGE_FROM);
//            message.setTo(email);
//            System.out.println(email);
//            message.setSubject("Sikeres regisztrálás");
//            message.setText("Kedves " + email + "! \n \n Köszönjük, hogy regisztráltál az oldalunkra!"
//                    +"Aktiváld pls: \n"+"http://localhost:4200/login\n");
//            javaMailSender.send(message);
//
//        } catch (Exception e) {
//            logger.error("Hiba e-mail küldéskor az alábbi címre: " + email + " " + e);
//        }
//    }

    //----------REGISTRATION  -> SAVE A USER----------

    public void saveUserRegistration(RegistrationDetails registrationDetails) throws Exception {
        Account otherAccount = accountRepository.findByEmail(registrationDetails.getEmail());
        if (otherAccount == null) {
            registrationDetails.setPassword(passwordEncoder.encode(registrationDetails.getPassword()));
            Account account = new Account(registrationDetails);
            account.setRole(Role.ROLE_USER);
            accountRepository.save(account);

            sendConfirmationMail(account);

        } else {
            throw new Exception("Mail already taken!");
        }
    }

    public void saveHotelOwnerRegistration(RegistrationDetails registrationDetails) throws Exception {
        Account otherAccount = accountRepository.findByEmail(registrationDetails.getEmail());
        if (otherAccount == null) {
            registrationDetails.setPassword(passwordEncoder.encode(registrationDetails.getPassword()));
            Account account = new Account(registrationDetails);
            account.setRole(Role.ROLE_HOTELOWNER);
            accountRepository.save(account);

            sendConfirmationMail(account);

        } else {
            throw new Exception("Mail already taken!");
        }

    }

    public void sendConfirmationMail(Account account) {
        ConfirmationToken confirmationToken = new ConfirmationToken(account);
        confirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(MESSAGE_FROM);
        message.setTo(account.getEmail());
        message.setSubject("Complete Registration!");
        message.setText("To confirm your account, please click here : "
                + this.mailSenderAddress + "/login/" + confirmationToken.getConfirmationToken());
        javaMailSender.send(message);
    }

    public ConfirmationToken findToken(String confirmationToken) {
        return confirmationTokenRepository.findByConfirmationToken(confirmationToken);
    }

    public void deleteToken(ConfirmationToken confirmationToken) {
        confirmationTokenRepository.delete(confirmationToken);
    }


    //----------CHECK THE MAIL----------
    //ha a mail már benn van,akkor "FALSE"-t ad vissza
    public boolean checkIfEmailIsTaken(String id, String email) {
        boolean result = false;
        if (!id.equalsIgnoreCase("undefined")) {  //ha létezik az email ID
            Long longId;
            try {
                longId = Long.valueOf(id);  //stringből long lesz
            } catch (NumberFormatException nfe) {
                logger.info("Invalid id provided for name check");
                return false;
            }   //megnézi, h az ID-hoz tartozik-e valami
            Account accountToCheck = accountRepository.findById(longId).orElse(null);  //orElse-> ha nem létezik, null-t ad vissza

            if (accountToCheck != null && !accountToCheck.getEmail().equalsIgnoreCase(email)) {//ha van ott valami és a beirt email nem azonos a tárolttal
                result = !accountRepository.findAllByEmail(email).isEmpty(); //isEmpty-> true, ha üres
            }
        } else {
            result = !accountRepository.findAllByEmail(email).isEmpty();
        }
        return result;
    }

    //----------CREATE DEFAULT ADMIN----------

    public void checkAdmin() {
        Account adminAccount = accountRepository.findByEmail(ADMINMAIL);
        if (adminAccount == null) {
            Account newAdmin = new Account();
            newAdmin.setEmail(ADMINMAIL);
            newAdmin.setPassword(passwordEncoder.encode("Admin"));
            newAdmin.setRole(Role.ROLE_ADMIN);
            newAdmin.setEnabled(true);
            newAdmin.setUsername(newAdmin.getEmail());
            newAdmin.setAddress("Budapest, Baross utca");
            newAdmin.setFirstname("Sylvester");
            newAdmin.setLastname("Stallone");
            newAdmin.setRegistrationDate(LocalDateTime.now());
            accountRepository.save(newAdmin);
        } else if (adminAccount.getRole() != Role.ROLE_ADMIN) {
            adminAccount.setRole(Role.ROLE_ADMIN);
        }
    }

//----------CREATE DEFAULT USER----------

    public void checkUser() {
        Account userAccount = accountRepository.findByEmail(USERMAIL);
        if (userAccount == null) {
            Account newUser = new Account();
            newUser.setEmail(USERMAIL);
            newUser.setPassword(passwordEncoder.encode("User"));
            newUser.setRole(Role.ROLE_USER);
            newUser.setEnabled(true);
            newUser.setUsername(newUser.getEmail());
            newUser.setAddress("Cemetery street");
            newUser.setFirstname("Bruce");
            newUser.setLastname("Lee");
            newUser.setRegistrationDate(LocalDateTime.now());
            accountRepository.save(newUser);
        } else if (userAccount.getRole() != Role.ROLE_USER) {
            userAccount.setRole(Role.ROLE_USER);
        }
    }

//----------CREATE DEFAULT HOTELOWNER----------

    public void checkHotelOwner() {
        Account hotelOwnerAccount = accountRepository.findByEmail(HOTELOWNERMAIL);
        if (hotelOwnerAccount == null) {
            Account newHotelOwner = new Account();
            newHotelOwner.setEmail(HOTELOWNERMAIL);
            newHotelOwner.setPassword(passwordEncoder.encode("Hotelowner"));
            newHotelOwner.setRole(Role.ROLE_HOTELOWNER);
            newHotelOwner.setEnabled(true);
            newHotelOwner.setUsername(newHotelOwner.getEmail());
            newHotelOwner.setAddress("God street");
            newHotelOwner.setFirstname("Chuck");
            newHotelOwner.setLastname("Norris");
            newHotelOwner.setRegistrationDate(LocalDateTime.now());
            newHotelOwner.setHotelId(1L);
            accountRepository.save(newHotelOwner);
        } else if (hotelOwnerAccount.getRole() != Role.ROLE_HOTELOWNER) {
            hotelOwnerAccount.setRole(Role.ROLE_HOTELOWNER);
        }
    }

    public Account findAccountByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public void saveConfirmedAccount(Account account) {
        this.accountRepository.save(account);
    }

    public Account findByUsername(String username) {
        return this.accountRepository.findByUsername(username);
    }

    public boolean accountIsActive(String email) {
        Account account = accountRepository.findByEmail(email);

        return account.isEnabled();
    }
}
