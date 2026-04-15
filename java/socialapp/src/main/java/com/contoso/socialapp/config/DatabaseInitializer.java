package com.contoso.socialapp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbc;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Initializing database schema...");

        jdbc.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id         TEXT PRIMARY KEY,
                    username   TEXT NOT NULL,
                    content    TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """);

        jdbc.execute("""
                CREATE TABLE IF NOT EXISTS comments (
                    id         TEXT PRIMARY KEY,
                    post_id    TEXT NOT NULL,
                    username   TEXT NOT NULL,
                    content    TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
                )
                """);

        jdbc.execute("""
                CREATE TABLE IF NOT EXISTS likes (
                    post_id  TEXT NOT NULL,
                    username TEXT NOT NULL,
                    liked_at TEXT NOT NULL,
                    PRIMARY KEY (post_id, username),
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
                )
                """);

        log.info("Database schema initialized successfully.");
    }
}
