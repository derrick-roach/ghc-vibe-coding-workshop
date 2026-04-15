package com.contoso.socialapp.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@RestController
@Slf4j
public class OpenApiController {

    @GetMapping(value = "/openapi.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> openApiSpec() throws IOException {
        ClassPathResource resource = new ClassPathResource("openapi.yaml");
        try (InputStream is = resource.getInputStream()) {
            Yaml yaml = new Yaml();
            Map<String, Object> spec = yaml.load(is);
            return ResponseEntity.ok(spec);
        }
    }

    @GetMapping(value = "/docs", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> swaggerUi() {
        String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Simple Social Media API</title>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" type="text/css" href="/webjars/swagger-ui/swagger-ui.css">
                </head>
                <body>
                <div id="swagger-ui"></div>
                <script src="/webjars/swagger-ui/swagger-ui-bundle.js"></script>
                <script src="/webjars/swagger-ui/swagger-ui-standalone-preset.js"></script>
                <script>
                window.onload = function() {
                    SwaggerUIBundle({
                        url: "/openapi.json",
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                        ],
                        plugins: [
                            SwaggerUIBundle.plugins.DownloadUrl
                        ],
                        layout: "StandaloneLayout"
                    })
                }
                </script>
                </body>
                </html>
                """;
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
