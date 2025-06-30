package com.jonathan.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jonathan.backend.entidades.Seguimiento;

public interface ISeguimientoDAO extends JpaRepository<Seguimiento, Long> {
    List<Seguimiento> findByCitasIdCita(Long idCita);
}