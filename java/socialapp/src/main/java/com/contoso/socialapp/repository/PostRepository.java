package com.contoso.socialapp.repository;

import com.contoso.socialapp.dto.PostDto;
import com.contoso.socialapp.dto.PostRequest;
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
public class PostRepository {

    private static final String POST_SELECT = """
            SELECT
                p.id, p.username, p.content, p.created_at, p.updated_at,
                COUNT(DISTINCT l.username) AS likes_count,
                COUNT(DISTINCT c.id)       AS comments_count
            FROM posts p
            LEFT JOIN likes    l ON l.post_id = p.id
            LEFT JOIN comments c ON c.post_id = p.id
            """;

    private final JdbcTemplate jdbc;

    private PostDto mapPost(ResultSet rs, int rowNum) throws SQLException {
        return new PostDto(
                rs.getString("id"),
                rs.getString("username"),
                rs.getString("content"),
                rs.getInt("likes_count"),
                rs.getInt("comments_count"),
                rs.getString("created_at"),
                rs.getString("updated_at")
        );
    }

    public List<PostDto> findAll() {
        return jdbc.query(POST_SELECT + " GROUP BY p.id ORDER BY p.created_at DESC", this::mapPost);
    }

    public Optional<PostDto> findById(String id) {
        try {
            PostDto post = jdbc.queryForObject(
                    POST_SELECT + " WHERE p.id = ? GROUP BY p.id",
                    this::mapPost,
                    id
            );
            return Optional.ofNullable(post);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public PostDto save(PostRequest request) {
        String id = UUID.randomUUID().toString();
        String now = DateUtils.nowIso();
        jdbc.update(
                "INSERT INTO posts (id, username, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                id, request.getUsername(), request.getContent(), now, now
        );
        return new PostDto(id, request.getUsername(), request.getContent(), 0, 0, now, now);
    }

    public Optional<PostDto> update(String id, PostRequest request) {
        String now = DateUtils.nowIso();
        int rows = jdbc.update(
                "UPDATE posts SET content = ?, updated_at = ? WHERE id = ?",
                request.getContent(), now, id
        );
        if (rows == 0) return Optional.empty();
        return findById(id);
    }

    public boolean deleteById(String id) {
        int rows = jdbc.update("DELETE FROM posts WHERE id = ?", id);
        return rows > 0;
    }
}
