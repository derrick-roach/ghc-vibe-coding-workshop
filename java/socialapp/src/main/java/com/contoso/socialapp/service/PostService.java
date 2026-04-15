package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.PostDto;
import com.contoso.socialapp.dto.PostRequest;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<PostDto> getAllPosts() {
        return postRepository.findAll();
    }

    public PostDto createPost(PostRequest request) {
        return postRepository.save(request);
    }

    public PostDto getPostById(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    public PostDto updatePost(String postId, PostRequest request) {
        // Verify the post exists first
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return postRepository.update(postId, request)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    public void deletePost(String postId) {
        if (!postRepository.deleteById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }
    }
}
