package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.CommentDto;
import com.contoso.socialapp.dto.CommentRequest;
import com.contoso.socialapp.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDto>> listComments(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(
            @PathVariable String postId,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.createComment(postId, request));
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDto> getComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        return ResponseEntity.ok(commentService.getCommentById(postId, commentId));
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.updateComment(postId, commentId, request));
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        commentService.deleteComment(postId, commentId);
    }
}
