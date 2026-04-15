package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.LikeDto;
import com.contoso.socialapp.exception.BadRequestException;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.repository.LikeRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public LikeDto likePost(String postId, String username) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return likeRepository.addLike(postId, username)
                .orElseThrow(() -> new BadRequestException("Post already liked by this user"));
    }

    public void unlikePost(String postId, String username) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!likeRepository.removeLike(postId, username)) {
            throw new ResourceNotFoundException("Like not found");
        }
    }
}
