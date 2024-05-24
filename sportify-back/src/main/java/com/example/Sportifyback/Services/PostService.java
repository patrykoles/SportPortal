package com.example.Sportifyback.Services;

import com.example.Sportifyback.Dto.*;
import com.example.Sportifyback.Entities.Comment;
import com.example.Sportifyback.Entities.Participation;
import com.example.Sportifyback.Entities.User;
import com.example.Sportifyback.Exceptions.AppException;
import com.example.Sportifyback.Mappers.PostMapper;
import com.example.Sportifyback.Repositories.CommentRepository;
import com.example.Sportifyback.Repositories.ParticipationRepository;
import com.example.Sportifyback.Repositories.PostRepository;
import com.example.Sportifyback.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.Sportifyback.Entities.Post;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@RequiredArgsConstructor
@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final UserRepository userRepository;
    private final ParticipationRepository participationRepository;
    private final CommentRepository commentRepository;
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public PostDto addPost(UserDto authUser, AddPostDto addPostDto) {
        User user = userRepository.findById(authUser.getId())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        Post post = postMapper.addPostToPost(addPostDto);
        post.setNoParticipants(1);
        post.setAuthor(user);
        LocalTime time = LocalTime.parse(addPostDto.getTime());
        post.setTime(time);
        LocalDate date = LocalDate.parse(addPostDto.getDate());
        post.setDate(date);
        Post savedPost = postRepository.save(post);

        return postMapper.toPostDto(post);
    }

    public List<ShowPostDto> getAllPosts(UserDto authUser) {
        LocalDate today = LocalDate.now();
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        List<Post> posts = postRepository.findByDateGreaterThanEqual(today, sortByDateTimeAsc);
        List<ShowPostDto> newPosts = new ArrayList<>();
        posts.forEach(post -> {
            ShowPostDto showPostDto = postMapper.toShowPostDto(post);
            showPostDto.setTime(post.getTime().format(timeFormatter));
            showPostDto.setUserId(post.getAuthor().getId());
            showPostDto.setUserLogin(post.getAuthor().getLogin());
            List<Participation> participations = participationRepository.findByPostIdAndUserId(post.getId(), authUser.getId());
            if (!participations.isEmpty()) {
                showPostDto.setIsJoined("true");
            } else {
                showPostDto.setIsJoined("false");
            }
            newPosts.add(showPostDto);
        });

        return newPosts;

    }

    public String delete(UserDto authUser, Long id) {
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        Post post = postRepository.getReferenceById(id);
        if(authUser.getId().equals(post.getAuthor().getId())){
            List<Participation> participations = participationRepository.findByPostId(post.getId());
            participations.forEach(participation -> {
                if(participation.getPost().getId().equals(post.getId())){
                    participationRepository.deleteById(participation.getId());
                }
            });
            List<Comment> comments = commentRepository.findByPostId(post.getId(), sortByDateTimeAsc);
            comments.forEach(comment -> {
                if (comment.getPost().getId().equals(post.getId())){
                    commentRepository.deleteById(comment.getId());
                }
            });
            deleteWithoutPerm(id);
            return "Post by id "+id+"deleted successfully";
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public void deleteWithoutPerm(Long id) {
        postRepository.deleteById(id);
    }

    public AddPostDto getPostInfo(UserDto authUser, Long id) {
        Post post = postRepository.getReferenceById(id);
        if (authUser.getId().equals(post.getAuthor().getId())){
            AddPostDto addPostDto = postMapper.toAddPostDto(post);
            addPostDto.setTime(post.getTime().format(timeFormatter));
            addPostDto.setDate(post.getDate().format(dateFormatter));
            return addPostDto;
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public String changePost(UserDto authUser, Long id, AddPostDto addPostDto) {
        Post post = postRepository.getReferenceById(id);
        if(authUser.getId().equals(post.getAuthor().getId())){
            post.setTitle(addPostDto.getTitle());
            post.setDescription(addPostDto.getDescription());
            LocalTime time = LocalTime.parse(addPostDto.getTime());
            post.setTime(time);
            LocalDate date = LocalDate.parse(addPostDto.getDate());
            post.setDate(date);
            post.setLocation(addPostDto.getLocation());
            post.setSport(addPostDto.getSport());
            Post savedPost = postRepository.save(post);
            return "Post by id "+id+" changed successfully";
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public List<ShowPostDto> getFilteredPosts(UserDto authUser, FilterDto filterDto) {
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        List<Post> posts = postRepository.findAll(sortByDateTimeAsc);
        List<ShowPostDto> newPosts = new ArrayList<>();
        AtomicBoolean testResult = new AtomicBoolean();
        posts.forEach(post -> {
            testResult.set(testPost(post, filterDto));
            if(testResult.get()) {
                ShowPostDto showPostDto = postMapper.toShowPostDto(post);
                showPostDto.setTime(post.getTime().format(timeFormatter));
                showPostDto.setUserId(post.getAuthor().getId());
                showPostDto.setUserLogin(post.getAuthor().getLogin());
                List<Participation> participations = participationRepository.findByPostIdAndUserId(post.getId(), authUser.getId());
                if (!participations.isEmpty()) {
                    showPostDto.setIsJoined("true");
                } else {
                    showPostDto.setIsJoined("false");
                }
                newPosts.add(showPostDto);
            }
        });

        return newPosts;
    }

    private boolean testPost(Post post, FilterDto filterDto) {
        if(!filterDto.getSport().equals("") && !post.getSport().equals(filterDto.getSport()))
            return false;
        if(!filterDto.getStartDate().equals("")){
            LocalDate startDate = LocalDate.parse(filterDto.getStartDate());
            if(post.getDate().isBefore(startDate))
                return false;
        }
        if(!filterDto.getEndDate().equals("")){
            LocalDate endDate = LocalDate.parse(filterDto.getEndDate());
            if (post.getDate().isAfter(endDate))
                return false;
        }
        if (!filterDto.getStartTime().equals("") && !filterDto.getEndTime().equals("")) {
            LocalTime startTime = LocalTime.parse(filterDto.getStartTime());
            LocalTime endTime = LocalTime.parse(filterDto.getEndTime());
            LocalTime postTime = post.getTime();

            if (endTime.isBefore(startTime)) {
                if (postTime.isBefore(endTime) || postTime.isAfter(startTime))
                    return true;
            } else {
                if (postTime.isAfter(startTime) && postTime.isBefore(endTime))
                    return true;
            }
            return false;
        } else if (!filterDto.getStartTime().equals("")) {
            LocalTime startTime = LocalTime.parse(filterDto.getStartTime());
            LocalTime postTime = post.getTime();

            if (postTime.isAfter(startTime) || postTime.equals(LocalTime.MIDNIGHT))
                return true;
            return false;
        } else if (!filterDto.getEndTime().equals("")) {
            LocalTime endTime = LocalTime.parse(filterDto.getEndTime());
            LocalTime postTime = post.getTime();

            if (postTime.isBefore(endTime) || postTime.equals(LocalTime.MIDNIGHT))
                return true;
            return false;
        }

        return true;
    }

    public void increaseParticipants(Long id) {
        Post post = postRepository.getReferenceById(id);
        post.setNoParticipants(post.getNoParticipants() + 1);
        Post savedPost = postRepository.save(post);

    }
    public void decreaseParticipants(Long id) {
        Post post = postRepository.getReferenceById(id);
        post.setNoParticipants(post.getNoParticipants() - 1);
        Post savedPost = postRepository.save(post);

    }

    public List<ShowPostDto> getUserPosts(UserDto authUser) {
        Sort sortByDateTimeDesc = Sort.by(Sort.Direction.DESC, "date", "time");
        List<Post> posts = postRepository.findByAuthorId(authUser.getId(), sortByDateTimeDesc);
        List<ShowPostDto> newPosts = new ArrayList<>();
        posts.forEach(post -> {
            if(post.getAuthor().getId().equals(authUser.getId())) {
                ShowPostDto showPostDto = postMapper.toShowPostDto(post);
                showPostDto.setTime(post.getTime().format(timeFormatter));
                showPostDto.setUserId(post.getAuthor().getId());
                showPostDto.setUserLogin(post.getAuthor().getLogin());
                showPostDto.setIsJoined("true");
                newPosts.add(showPostDto);
            }
        });

        return newPosts;
    }

    public List<ShowPostDto> getJoinedPosts(UserDto authUser) {
        LocalDate today = LocalDate.now();
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        List<Post> posts = postRepository.findByDateGreaterThanEqual(today, sortByDateTimeAsc);
        List<ShowPostDto> newPosts = new ArrayList<>();
        posts.forEach(post -> {
            List<Participation> participations = participationRepository.findByPostIdAndUserId(post.getId(), authUser.getId());
            if (!participations.isEmpty()) {
                ShowPostDto showPostDto = postMapper.toShowPostDto(post);
                showPostDto.setTime(post.getTime().format(timeFormatter));
                showPostDto.setUserId(post.getAuthor().getId());
                showPostDto.setUserLogin(post.getAuthor().getLogin());
                showPostDto.setIsJoined("true");
                newPosts.add(showPostDto);
            }
        });

        return newPosts;
    }
}
