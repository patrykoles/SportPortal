package com.example.Sportifyback.Services;

import com.example.Sportifyback.Dto.CommentDto;
import com.example.Sportifyback.Dto.PostDto;
import com.example.Sportifyback.Dto.ShowCommentDto;
import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Entities.Comment;
import com.example.Sportifyback.Entities.Post;
import com.example.Sportifyback.Entities.User;
import com.example.Sportifyback.Exceptions.AppException;
import com.example.Sportifyback.Mappers.CommentMapper;
import com.example.Sportifyback.Repositories.CommentRepository;
import com.example.Sportifyback.Repositories.PostRepository;
import com.example.Sportifyback.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {
    public final CommentRepository commentRepository;
    public final PostRepository postRepository;
    public final UserRepository userRepository;
    public final CommentMapper commentMapper;

    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public ShowCommentDto addComment(UserDto authUser, CommentDto commentDto, Long postId) {
        User user = userRepository.findById(authUser.getId())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        Post post = postRepository.findById(postId)
                .orElseThrow(() ->new AppException("Post not found", HttpStatus.NOT_FOUND));
        Comment newComment = new Comment();
        newComment.setContent(commentDto.getContent());
        LocalTime time = LocalTime.parse(commentDto.getTime());
        newComment.setTime(time);
        LocalDate date = LocalDate.parse(commentDto.getDate());
        newComment.setDate(date);
        newComment.setUser(user);
        newComment.setPost(post);
        Comment savedComment = commentRepository.save(newComment);

        ShowCommentDto showCommentDto = new ShowCommentDto();
        showCommentDto.setId(savedComment.getId());
        showCommentDto.setContent(savedComment.getContent());
        showCommentDto.setUserId(savedComment.getUser().getId());
        showCommentDto.setUserLogin(savedComment.getUser().getLogin());
        showCommentDto.setDate(savedComment.getDate().format(dateFormatter));
        showCommentDto.setTime(savedComment.getTime().format(timeFormatter));


        return showCommentDto;
    }

    public String delete(UserDto authUser, Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException("Comment not found", HttpStatus.NOT_FOUND));
        if(comment.getUser().getId().equals(authUser.getId())){
            commentRepository.deleteById(comment.getId());
            return "Comment by id "+id+" deleted successfully";
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public String changeComment(UserDto authUser, Long id, CommentDto commentDto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException("Comment not found", HttpStatus.NOT_FOUND));
        if (comment.getUser().getId().equals(authUser.getId())){
            comment.setContent(commentDto.getContent());
            LocalTime time = LocalTime.parse(commentDto.getTime());
            comment.setTime(time);
            LocalDate date = LocalDate.parse(commentDto.getDate());
            comment.setDate(date);
            Comment savedComment = commentRepository.save(comment);
            return "Comment by id "+id+" deleted successfuly";
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public List<ShowCommentDto> getAllComments(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() ->new AppException("Post not found", HttpStatus.NOT_FOUND));
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        List<Comment> comments = commentRepository.findByPostId(id, sortByDateTimeAsc);
        List<ShowCommentDto> readyComments = new ArrayList<>();
        comments.forEach(comment -> {
            if (comment.getPost().getId().equals(id)){
                ShowCommentDto showCommentDto = new ShowCommentDto();
                showCommentDto.setId(comment.getId());
                showCommentDto.setContent(comment.getContent());
                showCommentDto.setUserId(comment.getUser().getId());
                showCommentDto.setUserLogin(comment.getUser().getLogin());
                showCommentDto.setDate(comment.getDate().format(dateFormatter));
                showCommentDto.setTime(comment.getTime().format(timeFormatter));
                readyComments.add(showCommentDto);
            }
        });
        return readyComments;
    }
}
