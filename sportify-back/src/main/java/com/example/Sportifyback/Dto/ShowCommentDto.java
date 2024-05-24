package com.example.Sportifyback.Dto;

import com.example.Sportifyback.Entities.Post;
import com.example.Sportifyback.Entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ShowCommentDto {
    private Long id;
    private Long userId;
    private String userLogin;
    private String date;
    private String time;
    private String content;
}
