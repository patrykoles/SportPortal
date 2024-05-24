package com.example.Sportifyback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SignUpDto {
    private String firstName;
    private String lastName;
    private String birthday;
    private String description;
    private String login;
    private char[] password;
}
