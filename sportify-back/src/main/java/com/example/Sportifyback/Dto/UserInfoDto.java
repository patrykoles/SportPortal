package com.example.Sportifyback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserInfoDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String birthday;
    private String description;
    private String login;
}
