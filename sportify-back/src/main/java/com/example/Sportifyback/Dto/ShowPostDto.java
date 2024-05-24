package com.example.Sportifyback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ShowPostDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private String time;
    private String location;
    private String sport;
    private int noParticipants;
    private Long userId;
    private String userLogin;
    private String isJoined;
}
