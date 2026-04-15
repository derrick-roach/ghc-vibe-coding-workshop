package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.CommentDto;
import com.contoso.socialapp.dto.CommentRequest;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.repository.CommentRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<CommentDto> getCommentsByPostId(String postId) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return commentRepository.findByPostId(postId);
    }

    public CommentDto createComment(String postId, CommentRequest request) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return commentRepository.save(postId, request);
    }

    public CommentDto getCommentById(String postId, String commentId) {
        return commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    public CommentDto updateComment(String postId, String commentId, CommentRequest request) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return commentRepository.update(postId, commentId, request)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    public void deleteComment(String postId, String commentId) {
        if (!commentRepository.deleteByIdAndPostId(commentId, postId)) {
            throw new ResourceNotFoundException("Comment not found");
        }
    }
}
