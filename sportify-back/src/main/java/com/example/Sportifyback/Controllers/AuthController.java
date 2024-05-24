package com.example.Sportifyback.Controllers;

import com.example.Sportifyback.Config.UserAuthProvider;
import com.example.Sportifyback.Dto.CredentialsDto;
import com.example.Sportifyback.Dto.SignUpDto;
import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RequiredArgsConstructor
@RestController
public class AuthController {
    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsDto){
        UserDto user = userService.login(credentialsDto);

        user.setToken(userAuthProvider.createToken(user.getId()));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto signUpDto){
        UserDto user = userService.register(signUpDto);
        user.setToken(userAuthProvider.createToken(user.getId()));
        return ResponseEntity.created(URI.create("/users/"+user.getId()))
                .body(user);
    }
}
