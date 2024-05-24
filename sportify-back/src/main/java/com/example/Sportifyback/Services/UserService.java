package com.example.Sportifyback.Services;

import com.example.Sportifyback.Dto.*;
import com.example.Sportifyback.Entities.Comment;
import com.example.Sportifyback.Entities.Participation;
import com.example.Sportifyback.Entities.Post;
import com.example.Sportifyback.Entities.User;
import com.example.Sportifyback.Exceptions.AppException;
import com.example.Sportifyback.Mappers.UserMapper;
import com.example.Sportifyback.Repositories.CommentRepository;
import com.example.Sportifyback.Repositories.ParticipationRepository;
import com.example.Sportifyback.Repositories.PostRepository;
import com.example.Sportifyback.Repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.nio.CharBuffer;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final PostService postService;
    private final PostRepository postRepository;
    private final ParticipationRepository participationRepository;
    private final CommentRepository commentRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public UserDto findByLogin(String login){
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public UserDto findById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public UserDto login(CredentialsDto credentialsDto){
        User user = userRepository.findByLogin(credentialsDto.getLogin())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())){
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }
    public UserDto register(SignUpDto userDto){
        Optional<User> optionalUser = userRepository.findByLogin(userDto.getLogin());
        if(optionalUser.isPresent()){
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(userDto);
        LocalDate bday = LocalDate.parse(userDto.getBirthday());
        user.setBirthday(bday);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

        User savedUser = userRepository.save(user);

        return userMapper.toUserDto(user);
    }

    public UserDto change(UserDto authUser, Long id, FullUserInfoDto fullUser){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        if (authUser.getId().equals(user.getId())){
            user.setFirstName(fullUser.getFirstName());
            user.setLastName(fullUser.getLastName());
            user.setLogin(fullUser.getLogin());
            user.setDescription(fullUser.getDescription());
            LocalDate bday = LocalDate.parse(fullUser.getBirthday());
            user.setBirthday(bday);
            User savedUser = userRepository.save(user);
            return userMapper.toUserDto(savedUser);
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public UserDto changePassword(UserDto authUser, Long id, PasswordChangeDto passwdChange){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        if (authUser.getId().equals(user.getId())){
            if(passwordEncoder.matches(CharBuffer.wrap(passwdChange.getCurrentPassword()), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(CharBuffer.wrap(passwdChange.getNewPassword())));
                User savedUser = userRepository.save(user);
                return userMapper.toUserDto(savedUser);
            }
            throw new AppException("Niepoprawne hasło", HttpStatus.BAD_REQUEST);
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public UserInfoDto getUserInfo(UserDto authUser, Long userId){
        UserDto user = findById(userId);
        if (authUser.getId().equals(user.getId())){
            return new UserInfoDto(user.getId(),user.getFirstName(), user.getLastName(),user.getBirthday().format(dateFormatter), user.getDescription(),user.getLogin());
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public FullUserInfoDto getFullUserInfo(UserDto authUser, Long userId){
        UserDto user = findById(userId);
        if (authUser.getId().equals(user.getId())){
            return new FullUserInfoDto(user.getFirstName(), user.getLastName(),user.getBirthday().format(dateFormatter), user.getDescription(),user.getLogin());
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public String delete(UserDto authUser, Long id){
        Sort sortByDateTimeAsc = Sort.by(Sort.Direction.ASC, "date", "time");
        UserDto user = findById(id);
        if (authUser.getId().equals(user.getId())){
            List<Post> userPosts = postRepository.findByAuthorId(user.getId(), sortByDateTimeAsc);
            userPosts.forEach(post -> {
                if(user.getId().equals(post.getAuthor().getId())){
                    postService.delete(authUser, post.getId());
                }
            });
            List<Participation> participations = participationRepository.findByUserId(user.getId());
            participations.forEach(participation -> {
                if(participation.getUser().getId().equals(user.getId())){
                    postService.decreaseParticipants(participation.getPost().getId());
                    participationRepository.deleteById(participation.getId());
                }
            });
            List<Comment> comments = commentRepository.findByUserId(user.getId());
            comments.forEach(comment -> {
                if (comment.getUser().getId().equals(user.getId())){
                    commentRepository.deleteById(comment.getId());
                }
            });
            userRepository.deleteById(id);
            return "User by id "+id+" deleted sucessfuly";
        }
        throw new AppException("Permission denied", HttpStatus.FORBIDDEN);
    }

    public UserInfoDto getPublicUserInfo(Long id) {
        UserDto user = findById(id);
        return new UserInfoDto(user.getId(),user.getFirstName(), user.getLastName(),user.getBirthday().format(dateFormatter), user.getDescription(),user.getLogin());
    }
}
