package com.abril.flowboard.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;
import java.io.IOException;

// Intercepta peticiones HTTP para validar y procesar tokens JWT en el header "Authorization"
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        // Extrae y valida el token JWT del header, establece la autenticación en el contexto si es válido
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (tokenProvider.isValid(token)) {
                var claims = tokenProvider.getClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                var auth = new UsernamePasswordAuthenticationToken(
                username, 
                null, 
                List.of(new SimpleGrantedAuthority(roleWithPrefix))
            );
          SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
