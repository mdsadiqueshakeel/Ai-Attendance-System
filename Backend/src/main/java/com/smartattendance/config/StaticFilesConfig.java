package com.smartattendance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class StaticFilesConfig implements WebMvcConfigurer {
    private final AppProperties props;

    public StaticFilesConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path root = Path.of(props.getUpload().getDir()).toAbsolutePath().normalize();
        // Serves files from UPLOAD_DIR under /files/**
        registry.addResourceHandler("/files/**")
                .addResourceLocations(root.toUri().toString())
                .setCachePeriod(3600);
    }
}

