package com.jonathan.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.IVehiculosDAO;
import com.jonathan.backend.dto.VehiculoDTO;
import com.jonathan.backend.entidades.Vehiculos;

@Service
public class VehiculoService {

	@Autowired
	private IVehiculosDAO vehiculoDAO;
	
	@Transactional(readOnly = true)
	public VehiculoDTO findByMatricula(String matricula) {
	    Vehiculos vehiculo = vehiculoDAO.findByMatricula(matricula);
	    if (vehiculo == null) return null;

	    VehiculoDTO dto = new VehiculoDTO();
	    dto.setIdVehiculo(vehiculo.getIdVehiculo());
	    dto.setMarca(vehiculo.getMarca());
	    dto.setModelo(vehiculo.getModelo());
	    dto.setMatricula(vehiculo.getMatricula());
	    dto.setAnoFabricacion(vehiculo.getAnoFabricacion());
	    dto.setTipoMotor(vehiculo.getTipoMotor());
	    return dto;
	}

	
	@Transactional(readOnly = true)
	public List<Vehiculos> findByUsuarioId(Long idUsuario) {
		return vehiculoDAO.findByUsuariosIdUsuario(idUsuario);
	}
	
	@Transactional(readOnly = true)
	public List<Vehiculos> findAll() {
		return vehiculoDAO.findAll();
	}
	
	@Transactional
	public void save(Vehiculos vehiculo) {
		vehiculoDAO.save(vehiculo);
	}
	@Transactional
	public void delete(Long id) {
		vehiculoDAO.deleteById(id);
	}
	
	@Transactional
	public void deleteByMatricula(String matricula) {
		vehiculoDAO.deleteByMatricula(matricula);
	}
	
	
	
	
	
}
