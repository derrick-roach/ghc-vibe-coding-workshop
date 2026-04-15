package com.contoso.socialapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private String id;
    private String username;
    private String content;
    private int likesCount;
    private int commentsCount;
    private String createdAt;
    private String updatedAt;
}
