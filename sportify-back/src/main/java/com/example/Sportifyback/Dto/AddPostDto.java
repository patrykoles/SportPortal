package com.example.Sportifyback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AddPostDto {
    private String title;
    private String description;
    private String date;
    private String time;
    private String location;
    private String sport;
}
