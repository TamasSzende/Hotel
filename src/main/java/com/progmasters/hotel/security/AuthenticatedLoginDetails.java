package com.progmasters.hotel.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

public class AuthenticatedLoginDetails {

    private String name;

    private String role;

    public AuthenticatedLoginDetails() {
    }

    public AuthenticatedLoginDetails(UserDetails user) {
        this.name = user.getUsername();
        this.role = findRole(user);
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
}
