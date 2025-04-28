package com.simanPrueba.fullstack_bakend.filtro;

import com.simanPrueba.fullstack_bakend.seguridad.JwtUtil;
import com.simanPrueba.fullstack_bakend.servicio.UsuarioServicio;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAutenticacionFiltro extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UsuarioServicio usuarioServicio;

    @Autowired
    public JwtAutenticacionFiltro(JwtUtil jwtUtil, UsuarioServicio usuarioServicio) {
        this.jwtUtil = jwtUtil;
        this.usuarioServicio = usuarioServicio;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Aquí agregamos la condición para ignorar las rutas públicas
        String path = request.getServletPath();
        if (path.startsWith("/auth/")) {  // Ignora todas las rutas que empiecen con /auth/
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        if (jwtUtil.esTokenValido(token)) {
            String correo = jwtUtil.extraerCorreo(token);
            UserDetails usuario = usuarioServicio.loadUserByUsername(correo);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    usuario, null, usuario.getAuthorities()
            );
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

}
