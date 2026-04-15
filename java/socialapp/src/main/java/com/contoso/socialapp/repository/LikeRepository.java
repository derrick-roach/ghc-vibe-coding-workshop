package com.contoso.socialapp.repository;

import com.contoso.socialapp.dto.LikeDto;
import com.contoso.socialapp.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LikeRepository {

    private final JdbcTemplate jdbc;

    public Optional<LikeDto> addLike(String postId, String username) {
        String now = DateUtils.nowIso();
        try {
            jdbc.update(
                    "INSERT INTO likes (post_id, username, liked_at) VALUES (?, ?, ?)",
                    postId, username, now
            );
            return Optional.of(new LikeDto(postId, username, now));
        } catch (DataIntegrityViolationException e) {
            // UNIQUE constraint violated — post already liked by this user
            return Optional.empty();
        }
    }

    public boolean removeLike(String postId, String username) {
        int rows = jdbc.update(
                "DELETE FROM likes WHERE post_id = ? AND username = ?",
                postId, username
        );
        return rows > 0;
    }
}
