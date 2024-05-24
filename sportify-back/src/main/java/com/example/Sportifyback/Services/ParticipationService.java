package com.example.Sportifyback.Services;

import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Entities.Participation;
import com.example.Sportifyback.Entities.Post;
import com.example.Sportifyback.Entities.User;
import com.example.Sportifyback.Exceptions.AppException;
import com.example.Sportifyback.Mappers.PostMapper;
import com.example.Sportifyback.Mappers.UserMapper;
import com.example.Sportifyback.Repositories.ParticipationRepository;
import com.example.Sportifyback.Repositories.PostRepository;
import com.example.Sportifyback.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ParticipationService {
    private final PostRepository postRepository;
    private final PostService postService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final ParticipationRepository participationRepository;
    public String joinPost(UserDto authUser, Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException("Post doesn't exist", HttpStatus.NOT_FOUND));
        if(post.getAuthor().getId().equals(authUser.getId())){
            return "Cannot join your own posts!";
        }
        postService.increaseParticipants(id);
        Participation participation = new Participation();
        User user = userRepository.findById(authUser.getId())
                        .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        participation.setUser(user);
        participation.setPost(post);
        Participation savedParticipation = participationRepository.save(participation);
        return "post with id "+id+" joined successfully";
    }

    public String leavePost(UserDto authUser, Long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException("Post doesn't exist", HttpStatus.NOT_FOUND));
        if(post.getAuthor().getId().equals(authUser.getId())){
            return "Cannot leave your own posts!";
        }
        postService.decreaseParticipants(id);
        List<Participation> participationList = participationRepository.findByPostIdAndUserId(post.getId(), authUser.getId());
        participationList.forEach(participation -> {
            if(participation.getUser().getId().equals(authUser.getId()) && participation.getPost().getId().equals(post.getId())){
                deleteWithoutPerm(participation.getId());
            }
        });
        return "post with id \"+id+\" leaved successfully";

    }

    public void deleteWithoutPerm(Long id){
        participationRepository.deleteById(id);
    }


}
