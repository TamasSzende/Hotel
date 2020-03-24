package com.progmasters.hotel.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

public class AuthenticatedLoginDetails {

    private Long id;
    private String name;
    private String role;
    private Long hotelId;

    public AuthenticatedLoginDetails() {
    }

    public AuthenticatedLoginDetails(UserDetails user) {
        this.name = user.getUsername();
        this.role = findRole(user);
        this.hotelId = 0L;
        this.id = 0L;
    }

    private String findRole(UserDetails user) {
        String role = null;
        List<GrantedAuthority> roles = user.getAuthorities().stream()
                .filter(authority -> authority.getAuthority().startsWith("ROLE_"))
                .collect(Collectors.toList());
        if (!roles.isEmpty()) {
            role = roles.get(0).getAuthority();
        }

        return role;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
