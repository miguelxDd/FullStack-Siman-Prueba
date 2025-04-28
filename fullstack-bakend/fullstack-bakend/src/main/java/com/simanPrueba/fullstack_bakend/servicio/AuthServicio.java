package com.simanPrueba.fullstack_bakend.servicio;

import com.simanPrueba.fullstack_bakend.entidad.Rol;
import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import com.simanPrueba.fullstack_bakend.repositorio.RolRepositorio;
import com.simanPrueba.fullstack_bakend.repositorio.UsuarioRepositorio;
import com.simanPrueba.fullstack_bakend.seguridad.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthServicio {

        private final UsuarioRepositorio usuarioRepositorio;
        private final RolRepositorio rolRepositorio;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenServicio refreshTokenServicio;
        private final JwtUtil jwtUtil;  // Lo crearemos luego
    @Autowired
    public AuthServicio(UsuarioRepositorio usuarioRepositorio,
                        RolRepositorio rolRepositorio,
                        PasswordEncoder passwordEncoder,
                        RefreshTokenServicio refreshTokenServicio,
                        JwtUtil jwtUtil) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.rolRepositorio = rolRepositorio;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenServicio = refreshTokenServicio;
        this.jwtUtil = jwtUtil;
    }


        public Usuario registrar(String nombre, String correo, String contrasenia) {
            if (usuarioRepositorio.existsByCorreo(correo)) {
                throw new RuntimeException("El correo ya está registrado en el Sistema");
            }

            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setCorreo(correo);
            usuario.setContrasenia(passwordEncoder.encode(contrasenia));  // Encripta la contraseña

            // Asignar rol OPERADOR por defecto
            Rol rolOperador = rolRepositorio.findByNombre("OPERADOR")
                    .orElseThrow(() -> new RuntimeException("Rol 'OPERADOR' no encontrado, Contacte al Administrador del Sistema"));

            HashSet<Rol> roles = new HashSet<>();
            roles.add(rolOperador);
            usuario.setRoles(roles);

            return usuarioRepositorio.save(usuario);
        }

        public String login(String correo, String contrasenia) {
            Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!passwordEncoder.matches(contrasenia, usuario.getContrasenia())) {
                throw new RuntimeException("Contraseña incorrecta");
            }

            // Generar JWT
            return jwtUtil.generarToken(usuario);
        }

    public Usuario validarLogin(String correo, String contraseña) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(contraseña, usuario.getContrasenia())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario desactivado");
        }

        return usuario;
    }

}
