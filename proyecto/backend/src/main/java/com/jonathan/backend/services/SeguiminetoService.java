package com.jonathan.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.ICitasDAO;
import com.jonathan.backend.dao.ISeguimientoDAO;
import com.jonathan.backend.dto.SeguimientoDTO;
import com.jonathan.backend.entidades.Citas;
import com.jonathan.backend.entidades.Seguimiento;

@Service
public class SeguiminetoService {

	@Autowired
	private ISeguimientoDAO seguimientoDao;
	@Autowired
	private ICitasDAO citasDao;


	@Transactional(readOnly = true)
	public List<Seguimiento> obtenerSeguimientosPorCita(Long idCita) {
		return seguimientoDao.findByCitasIdCita(idCita);
	}

	@Transactional(readOnly = true)
	public Seguimiento obtenerSeguimientoPorId(Long idSeguimiento) {
		return seguimientoDao.findById(idSeguimiento).orElse(null);
	}

	@Transactional
	public Seguimiento createSeguimiento(Seguimiento seguimiento) {
		return seguimientoDao.save(seguimiento);
	}

	@Transactional
	public Seguimiento updateSeguimiento(Long idSeguimiento, SeguimientoDTO seguimiento) {
	    Seguimiento seguimientoExistente = seguimientoDao.findById(idSeguimiento).orElse(null);
	    if (seguimientoExistente != null) {
	        seguimientoExistente.setDescripcion(seguimiento.getDescripcion());
	        seguimientoExistente.setImagenUrl(seguimiento.getImagenUrl());
	        seguimientoExistente.setEstado(seguimiento.getEstado());
	        seguimientoExistente.setFechaActualizacion(seguimiento.getFechaActualizacion());
	        // Asocia la cita si viene idCita
	        if (seguimiento.getIdCita() != null) {
	            Citas cita = citasDao.findById(seguimiento.getIdCita()).orElse(null);
	            if (cita != null) {
	                seguimientoExistente.setCitas(cita);
	            }
	        }
	        return seguimientoDao.save(seguimientoExistente);
	    }
	    return null;
	}
	
	@Transactional
	public void deleteSeguimiento(Long idSeguimiento) {
		seguimientoDao.deleteById(idSeguimiento);
	}
}