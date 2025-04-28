package com.simanPrueba.fullstack_bakend.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SeguridadConfiguracion {
    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder(){
        // Se utiliza BCryptPasswordEncoder para encriptar las contraseñas
        // se puede agregar hash a la contraseña para mayor seguridad
        return new BCryptPasswordEncoder();
    }


}
