package com.jonathan.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jonathan.backend.entidades.Citas;

public interface ICitasDAO extends JpaRepository<Citas, Long>{

	public List<Citas> findByUsuariosIdUsuario(Long idUsuario);
	public List<Citas> findByVehiculosIdVehiculo(Long idVehiculo);
	@Query("SELECT c FROM Citas c JOIN c.mecanicosCitases mc WHERE c.estado = :estado AND mc.usuarios.idUsuario = :idMecanico")
	List<Citas> findByEstadoAndMecanicoId(@Param("estado") String estado, @Param("idMecanico") Long idMecanico);
}
