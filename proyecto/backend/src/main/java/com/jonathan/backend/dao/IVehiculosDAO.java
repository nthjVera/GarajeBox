package com.jonathan.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jonathan.backend.entidades.Vehiculos;

public interface IVehiculosDAO extends JpaRepository<Vehiculos, Long> {

	
	Vehiculos findByMatricula(String matricula);
	List<Vehiculos> findByUsuariosIdUsuario(Long idUsuario);
	void deleteByMatricula(String matricula);
}
