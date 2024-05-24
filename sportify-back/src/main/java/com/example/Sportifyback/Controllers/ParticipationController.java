package com.example.Sportifyback.Controllers;

import com.example.Sportifyback.Config.TokenDecoder;
import com.example.Sportifyback.Dto.AddPostDto;
import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Entities.Post;
import com.example.Sportifyback.Services.ParticipationService;
import com.example.Sportifyback.Services.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ParticipationController {
    private final ParticipationService participationService;
    private final PostService postService;
    public final TokenDecoder tokenDecoder;

    @PutMapping("/joinpost/{id}")
    public String joinPost(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String message = participationService.joinPost(authUser, Long.valueOf(id));

        return message;
    }
    @PutMapping("/leavepost/{id}")
    public String leavePost(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String message = participationService.leavePost(authUser, Long.valueOf(id));

        return message;
    }
}
