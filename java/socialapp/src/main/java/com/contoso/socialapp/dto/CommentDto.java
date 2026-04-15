package com.contoso.socialapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String id;
    private String postId;
    private String username;
    private String content;
    private String createdAt;
    private String updatedAt;
}
