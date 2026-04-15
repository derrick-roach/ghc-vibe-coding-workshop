package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.LikeDto;
import com.contoso.socialapp.dto.LikeRequest;
import com.contoso.socialapp.service.LikeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<LikeDto> likePost(
            @PathVariable String postId,
            @Valid @RequestBody LikeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(likeService.likePost(postId, request.getUsername()));
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlikePost(
            @PathVariable String postId,
            @RequestParam String username) {
        likeService.unlikePost(postId, username);
    }
}
