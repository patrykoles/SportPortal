package com.example.Sportifyback.Repositories;

import com.example.Sportifyback.Entities.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByDateGreaterThanEqual(LocalDate date, Sort sort);

    List<Post> findByAuthorId(Long userId, Sort sort);
}
