package com.contoso.socialapp.repository;

import com.contoso.socialapp.dto.CommentDto;
import com.contoso.socialapp.dto.CommentRequest;
import com.contoso.socialapp.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CommentRepository {

    private final JdbcTemplate jdbc;

    private CommentDto mapComment(ResultSet rs, int rowNum) throws SQLException {
        return new CommentDto(
                rs.getString("id"),
                rs.getString("post_id"),
                rs.getString("username"),
                rs.getString("content"),
                rs.getString("created_at"),
                rs.getString("updated_at")
        );
    }

    public List<CommentDto> findByPostId(String postId) {
        return jdbc.query(
                "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
                this::mapComment,
                postId
        );
    }

    public Optional<CommentDto> findByIdAndPostId(String commentId, String postId) {
        try {
            CommentDto comment = jdbc.queryForObject(
                    "SELECT * FROM comments WHERE id = ? AND post_id = ?",
                    this::mapComment,
                    commentId, postId
            );
            return Optional.ofNullable(comment);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public CommentDto save(String postId, CommentRequest request) {
        String id = UUID.randomUUID().toString();
        String now = DateUtils.nowIso();
        jdbc.update(
                "INSERT INTO comments (id, post_id, username, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                id, postId, request.getUsername(), request.getContent(), now, now
        );
        return new CommentDto(id, postId, request.getUsername(), request.getContent(), now, now);
    }

    public Optional<CommentDto> update(String postId, String commentId, CommentRequest request) {
        String now = DateUtils.nowIso();
        int rows = jdbc.update(
                "UPDATE comments SET content = ?, updated_at = ? WHERE id = ? AND post_id = ?",
                request.getContent(), now, commentId, postId
        );
        if (rows == 0) return Optional.empty();
        return findByIdAndPostId(commentId, postId);
    }

    public boolean deleteByIdAndPostId(String commentId, String postId) {
        int rows = jdbc.update(
                "DELETE FROM comments WHERE id = ? AND post_id = ?",
                commentId, postId
        );
        return rows > 0;
    }
}
