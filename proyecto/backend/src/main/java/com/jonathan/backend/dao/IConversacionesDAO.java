package com.jonathan.backend.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jonathan.backend.entidades.Conversaciones;
import com.jonathan.backend.entidades.Usuarios;

public interface IConversacionesDAO extends JpaRepository<Conversaciones, Long> {
    Optional<Conversaciones> findByUsuariosByIdUsuario1AndUsuariosByIdUsuario2(Usuarios usuario1, Usuarios usuario2);

    // Para buscar en ambos sentidos (usuario1/usuario2 o usuario2/usuario1)
    Optional<Conversaciones> findByUsuariosByIdUsuario1AndUsuariosByIdUsuario2OrUsuariosByIdUsuario1AndUsuariosByIdUsuario2(
        Usuarios usuario1, Usuarios usuario2, Usuarios usuario2b, Usuarios usuario1b
    );
}