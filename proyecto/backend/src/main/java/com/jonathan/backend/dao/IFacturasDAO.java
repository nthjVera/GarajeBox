package com.jonathan.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jonathan.backend.entidades.Facturas;

public interface IFacturasDAO extends JpaRepository<Facturas, Long> {
	List<Facturas> findByCitasUsuariosIdUsuario(Long idUsuario);
	
	@Query("SELECT f FROM Facturas f JOIN FETCH f.citas c JOIN FETCH c.usuarios u JOIN FETCH c.vehiculos v WHERE f.idFactura = :id")
	Facturas findByIdWithCitaAndRelations(@Param("id") Long id);
}
