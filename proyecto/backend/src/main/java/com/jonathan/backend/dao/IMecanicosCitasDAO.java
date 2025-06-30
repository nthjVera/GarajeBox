package com.jonathan.backend.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jonathan.backend.entidades.MecanicosCitas;
import com.jonathan.backend.entidades.MecanicosCitasId;

public interface IMecanicosCitasDAO extends JpaRepository<MecanicosCitas, MecanicosCitasId> {
    Optional<MecanicosCitas> findByCitasIdCita(Long idCita);
    void deleteByCitasIdCitaAndUsuariosIdUsuario(Long idCita, Long idMecanico);
}