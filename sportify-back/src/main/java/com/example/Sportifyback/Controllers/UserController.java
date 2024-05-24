package com.example.Sportifyback.Controllers;

import com.example.Sportifyback.Config.TokenDecoder;
import com.example.Sportifyback.Dto.*;
import com.example.Sportifyback.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserController {

    public final UserService userService;
    public final TokenDecoder tokenDecoder;

    @GetMapping("/userinfo/{id}")
    public ResponseEntity<UserInfoDto> userinfo(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        UserInfoDto foundUser = userService.getUserInfo(authUser, Long.valueOf(id));

        return ResponseEntity.ok(foundUser);
    }

    @GetMapping("/publicuserinfo/{id}")
    public ResponseEntity<UserInfoDto> getPublicUserInfo(HttpServletRequest request, @PathVariable String id){
        UserInfoDto foundUser = userService.getPublicUserInfo(Long.valueOf(id));

        return ResponseEntity.ok(foundUser);
    }

    @GetMapping("/fulluserinfo/{id}")
    public ResponseEntity<FullUserInfoDto> fulluserinfo( HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        FullUserInfoDto foundUser = userService.getFullUserInfo(authUser, Long.valueOf(id));

        return ResponseEntity.ok(foundUser);
    }

    @PutMapping("/changeprofile/{id}")
    public ResponseEntity<UserDto> changeprofile(@RequestBody FullUserInfoDto fullUser, HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        UserDto changedUser = userService.change(authUser, Long.valueOf(id), fullUser);

        return ResponseEntity.ok(changedUser);
    }

    @PutMapping("/changepassword/{id}")
    public ResponseEntity<UserDto> changepassword(@RequestBody PasswordChangeDto passwdChange, HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        UserDto changedUser = userService.changePassword(authUser, Long.valueOf(id), passwdChange);

        return ResponseEntity.ok(changedUser);
    }

    @DeleteMapping("/deluser/{id}")
    String deleteUser(HttpServletRequest request, @PathVariable String id){
        UserDto authUser = tokenDecoder.findUser(request);
        String msg = userService.delete(authUser, Long.valueOf(id));

        return msg;

    }
}
