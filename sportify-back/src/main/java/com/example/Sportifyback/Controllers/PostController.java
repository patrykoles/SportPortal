package com.example.Sportifyback.Controllers;

import com.example.Sportifyback.Config.TokenDecoder;
import com.example.Sportifyback.Dto.*;
import com.example.Sportifyback.Services.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class PostController {
    private final PostService postService;
    public final TokenDecoder tokenDecoder;
    @PostMapping("/sendpost")
    public ResponseEntity<PostDto> sendPost(HttpServletRequest request, @RequestBody AddPostDto addPostDto){
        UserDto authUser = tokenDecoder.findUser(request);
        PostDto post = postService.addPost(authUser, addPostDto);
        return ResponseEntity.created(URI.create("/post/"+post.getId())).build();
    }

    @GetMapping("/allposts")
    public ResponseEntity<List<ShowPostDto>> getAllPosts(HttpServletRequest request){
        UserDto authUser = tokenDecoder.findUser(request);
        List<ShowPostDto> posts = postService.getAllPosts(authUser);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/filteredposts")
    public ResponseEntity<List<ShowPostDto>> getFilteredPosts(HttpServletRequest request){
        UserDto authUser = tokenDecoder.findUser(request);
        String sport = request.getParameter("sport");
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");

        FilterDto filterDto = FilterDto.builder()
                .sport(sport)
                .startDate(startDate)
                .endDate(endDate)
                .startTime(startTime)
                .endTime(endTime)
                .build();
        List<ShowPostDto> posts = postService.getFilteredPosts(authUser, filterDto);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/userposts")
    public ResponseEntity<List<ShowPostDto>> getUserPosts(HttpServletRequest request){
        UserDto authUser = tokenDecoder.findUser(request);
        List<ShowPostDto> posts = postService.getUserPosts(authUser);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/joinedposts")
    public ResponseEntity<List<ShowPostDto>> getJoinedPosts(HttpServletRequest request){
        UserDto authUser = tokenDecoder.findUser(request);
        List<ShowPostDto> posts = postService.getJoinedPosts(authUser);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/delpost/{id}")
    String deletePost(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String msg = postService.delete(authUser, Long.valueOf(id));

        return msg;

    }

    @GetMapping("/postinfo/{id}")
    public ResponseEntity<AddPostDto> getPostInfo(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        AddPostDto post = postService.getPostInfo(authUser, Long.valueOf(id));

        return ResponseEntity.ok(post);
    }

    @PutMapping("/changepost/{id}")
    public String changePost(@RequestBody AddPostDto addPostDto, HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String message = postService.changePost(authUser, Long.valueOf(id), addPostDto);

        return message;
    }
}
