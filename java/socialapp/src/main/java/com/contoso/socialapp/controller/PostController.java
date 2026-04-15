package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.PostDto;
import com.contoso.socialapp.dto.PostRequest;
import com.contoso.socialapp.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDto>> listPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(request));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable String postId,
            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(postId, request));
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
    }
}
