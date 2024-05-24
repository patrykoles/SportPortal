package com.example.Sportifyback.Controllers;

import com.example.Sportifyback.Config.TokenDecoder;
import com.example.Sportifyback.Dto.*;
import com.example.Sportifyback.Services.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class CommentController {
    public final TokenDecoder tokenDecoder;
    public final CommentService commentService;

    @PostMapping("/sendcomment/{postId}")
    public ResponseEntity<ShowCommentDto> sendComment(HttpServletRequest request, @RequestBody CommentDto commentDto, @PathVariable String postId){
        UserDto authUser = tokenDecoder.findUser(request);
        ShowCommentDto comment = commentService.addComment(authUser, commentDto, Long.valueOf(postId));
        return ResponseEntity.created(URI.create("/comment/"+comment.getId())).build();
    }

    @DeleteMapping("/delcomment/{id}")
    String deleteComment(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String msg = commentService.delete(authUser, Long.valueOf(id));

        return msg;

    }

    @PutMapping("/changecomment/{id}")
    public String changeComment(@RequestBody CommentDto commentDto, HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String message = commentService.changeComment(authUser, Long.valueOf(id), commentDto);

        return message;
    }

    @GetMapping("/getcomments/{postId}")
    public ResponseEntity<List<ShowCommentDto>> getAllPosts(HttpServletRequest request, @PathVariable String postId){
        List<ShowCommentDto> posts = commentService.getAllComments(Long.valueOf(postId));

        return ResponseEntity.ok(posts);
    }

}
