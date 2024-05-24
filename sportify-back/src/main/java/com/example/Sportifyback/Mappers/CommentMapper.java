package com.example.Sportifyback.Mappers;

import com.example.Sportifyback.Dto.CommentDto;
import com.example.Sportifyback.Entities.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentDto toCommentDto(Comment comment);
}
