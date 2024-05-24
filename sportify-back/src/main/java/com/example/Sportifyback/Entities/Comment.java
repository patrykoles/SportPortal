package com.example.Sportifyback.Entities;

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
@Entity
@Table(name = "app_comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private Post post;
    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private LocalTime time;
    @Column(nullable = false)
    private String content;
}
