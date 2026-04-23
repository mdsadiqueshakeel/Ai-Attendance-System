package com.smartattendance.config;

import com.smartattendance.security.JwtPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Logs every request with status + latency and a request id for tracing.
 * Avoids logging request bodies (which may contain passwords/tokens).
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    private static final String HDR_REQUEST_ID = "X-Request-Id";
    private static final String MDC_REQUEST_ID = "requestId";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Avoid double-noise from the default error dispatch.
        return "/error".equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        long start = System.nanoTime();

        String requestId = request.getHeader(HDR_REQUEST_ID);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }
        response.setHeader(HDR_REQUEST_ID, requestId);
        MDC.put(MDC_REQUEST_ID, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long tookMs = (System.nanoTime() - start) / 1_000_000;
            int status = response.getStatus();

            String method = request.getMethod();
            String path = request.getRequestURI();
            String query = request.getQueryString();
            String fullPath = (query == null || query.isBlank()) ? path : (path + "?" + query);

            String principalPart = "";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof JwtPrincipal jp) {
                principalPart = " userId=" + jp.getUserId() + " role=" + jp.getRole();
            }

            log.info("{} {} -> {} ({}ms) rid={}{}", method, fullPath, status, tookMs, requestId, principalPart);
            MDC.remove(MDC_REQUEST_ID);
        }
    }
}

