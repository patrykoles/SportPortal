package com.example.Sportifyback.Mappers;

import ch.qos.logback.core.model.ComponentModel;
import com.example.Sportifyback.Dto.SignUpDto;
import com.example.Sportifyback.Dto.UserDto;
import com.example.Sportifyback.Entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);

    @Mappings({
            @Mapping(target = "password", ignore = true),
            @Mapping(target = "birthday", ignore = true)
    })
    User signUpToUser(SignUpDto userDto);
}
