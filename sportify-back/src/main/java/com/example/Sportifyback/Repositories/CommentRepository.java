package com.example.Sportifyback.Repositories;

import com.example.Sportifyback.Entities.Comment;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId, Sort sort);
    List<Comment> findByUserId(Long userId);

    List<Comment> findByPostIdAndUserId(Long postId, Long userId);
}
