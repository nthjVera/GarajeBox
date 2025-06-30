package com.jonathan.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jonathan.backend.entidades.Usuarios;

public interface IUsuariosDAO extends JpaRepository<Usuarios, Long> {
	
	Usuarios findByEmail(String email);
}
