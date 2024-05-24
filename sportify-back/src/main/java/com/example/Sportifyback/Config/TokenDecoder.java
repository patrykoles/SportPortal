package com.example.Sportifyback.Config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Exceptions.AppException;
import com.example.Sportifyback.Services.UserService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Base64;

@RequiredArgsConstructor
@Component
public class TokenDecoder {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final UserService userService;

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }
    public UserDto findUser(HttpServletRequest request){
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(header != null){
            String[] elements = header.split(" ");

            if(elements.length == 2 && "Bearer".equals(elements[0])){
                JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey))
                        .build();
                DecodedJWT decoded = verifier.verify(elements[1]);
                UserDto user = userService.findById(Long.parseLong(decoded.getSubject()));

                return user;
            }
        }

        throw new AppException("User not found", HttpStatus.NOT_FOUND);
    }
}
