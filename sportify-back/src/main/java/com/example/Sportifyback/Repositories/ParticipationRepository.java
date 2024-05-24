package com.example.Sportifyback.Repositories;

import com.example.Sportifyback.Entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByPostId(Long postId);
    List<Participation> findByUserId(Long userId);

    List<Participation> findByPostIdAndUserId(Long postId, Long userId);
}
