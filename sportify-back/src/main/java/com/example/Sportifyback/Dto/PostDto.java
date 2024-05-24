package com.example.Sportifyback.Dto;

import com.example.Sportifyback.Entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PostDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private String sport;
    private int noParticipants;
    private User author;
}
