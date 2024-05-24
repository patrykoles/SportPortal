package com.example.Sportifyback.Mappers;

import com.example.Sportifyback.Dto.AddPostDto;
import com.example.Sportifyback.Dto.PostDto;
import com.example.Sportifyback.Dto.ShowPostDto;
import com.example.Sportifyback.Entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mappings({
            @Mapping(target = "time", ignore = true),
            @Mapping(target = "date", ignore = true)
    })
    Post addPostToPost(AddPostDto addPostDto);
    PostDto toPostDto(Post post);

    @Mapping(target = "time", ignore = true)
    ShowPostDto toShowPostDto(Post post);

    @Mappings({
            @Mapping(target = "time", ignore = true),
            @Mapping(target = "date", ignore = true)
    })
    AddPostDto toAddPostDto(Post post);
}
