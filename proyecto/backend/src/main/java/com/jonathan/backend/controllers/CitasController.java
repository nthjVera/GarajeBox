package com.jonathan.backend.controllers;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jonathan.backend.dao.IFacturasDAO;
import com.jonathan.backend.dto.CitaDTO;
import com.jonathan.backend.dto.FacturaDTO;
import com.jonathan.backend.dto.UsuarioDTO;
import com.jonathan.backend.dto.VehiculoDTO;
import com.jonathan.backend.entidades.Citas;
import com.jonathan.backend.entidades.Facturas;
import com.jonathan.backend.entidades.Seguimiento;
import com.jonathan.backend.services.CitasService;
import com.jonathan.backend.services.MecanicosCitasService;
import com.jonathan.backend.services.SeguiminetoService;
import com.jonathan.backend.services.UsuarioService;
import com.jonathan.backend.services.VehiculoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "*" })
public class CitasController {

	@Autowired
	private CitasService citasService;

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private VehiculoService vehiculoService;

	@Autowired
	private SeguiminetoService seguimientoService;

	@Autowired
	private MecanicosCitasService mecanicosCitasService;
	
	@Autowired
	private IFacturasDAO facturasDAO;

	@GetMapping("/citas")
	public ResponseEntity<?> getAllCitas() {
		try {
			List<Citas> citas = citasService.findAll();
			if (citas != null && !citas.isEmpty()) {
				List<CitaDTO> citasDTO = citas.stream().map(this::mapToDTO).collect(Collectors.toList());
				return ResponseEntity.ok(citasDTO);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener las citas");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/mecanico/{idMecanico}")
	public ResponseEntity<?> getCitasByMecanicoId(@PathVariable Long idMecanico) {
		try {
			List<Citas> citas = citasService.findAll();
			if (citas != null && !citas.isEmpty()) {
				List<CitaDTO> citasDTO = citas.stream().map(this::mapToDTO).collect(Collectors.toList());
				List<CitaDTO> citasFiltradas = citasDTO.stream().filter(
						cita -> cita.getMecanico() != null && cita.getMecanico().getIdUsuario().equals(idMecanico))
						.collect(Collectors.toList());
				if (!citasFiltradas.isEmpty()) {
					return ResponseEntity.ok(citasFiltradas);
				} else {
					return ResponseEntity.notFound().build();
				}
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener las citas");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/usuario/{id}")
	public ResponseEntity<?> getCitasByUsuarioId(@PathVariable Long id) {
		try {
			List<Citas> citas = citasService.findByUsuarioId(id);
			if (citas != null && !citas.isEmpty()) {
				List<CitaDTO> citasDTO = citas.stream().map(this::mapToDTO).collect(Collectors.toList());
				return ResponseEntity.ok(citasDTO);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener las citas");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/vehiculo/{id}")
	public ResponseEntity<?> getCitasByVehiculoId(@PathVariable Long id) {
		try {
			List<Citas> citas = citasService.findByVehiculoId(id);
			if (citas != null && !citas.isEmpty()) {
				List<CitaDTO> citasDTO = citas.stream().map(this::mapToDTO).collect(Collectors.toList());
				return ResponseEntity.ok(citasDTO);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener las citas");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/{id}")
	public ResponseEntity<?> getCitaById(@PathVariable Long id) {
		try {
			Citas cita = citasService.findById(id);
			if (cita != null) {
				CitaDTO citaDTO = mapToDTO(cita);
				return ResponseEntity.ok(citaDTO);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener la cita");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/usuario/{idUsuario}/vehiculo/{idVehiculo}")
	public ResponseEntity<?> getCitasByUsuarioAndVehiculo(@PathVariable Long idUsuario, @PathVariable Long idVehiculo) {
		try {
			List<Citas> citasUsuario = citasService.findByUsuarioId(idUsuario);
			List<Citas> citasVehiculo = citasService.findByVehiculoId(idVehiculo);
			citasUsuario.retainAll(citasVehiculo);

			if (citasUsuario != null && !citasUsuario.isEmpty()) {
				List<CitaDTO> citasDTO = citasUsuario.stream().map(this::mapToDTO).collect(Collectors.toList());
				return ResponseEntity.ok(citasDTO);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener las citas");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/citas/seguimiento/{idCita}")
	public ResponseEntity<?> getSeguimientoByCita(@PathVariable Long idCita) {
		try {
			List<Seguimiento> seguimientos = seguimientoService.obtenerSeguimientosPorCita(idCita);
			if (seguimientos != null && !seguimientos.isEmpty()) {
				return ResponseEntity.ok(seguimientos);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al obtener los seguimientos");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/facturas/usuario/{idUsuario}")
	public List<FacturaDTO> getFacturasByUsuario(@PathVariable Long idUsuario) {
	    List<Facturas> facturas = facturasDAO.findByCitasUsuariosIdUsuario(idUsuario);
	    return facturas.stream().map(f -> {
	        FacturaDTO dto = new FacturaDTO();
	        dto.setIdFactura(f.getIdFactura());
	        dto.setFechaEmision(f.getFechaEmision());
	        dto.setMontoTotal(f.getMontoTotal());
	        dto.setEstadoPago(f.getEstadoPago());
	        CitaDTO citaDto = new CitaDTO();
	        citaDto.setIdCita(f.getCitas().getIdCita());
	        citaDto.setFechaHora(f.getCitas().getFechaHora());
	        citaDto.setDescripcion(f.getCitas().getDescripcion());
	        citaDto.setEstado(f.getCitas().getEstado());
	        dto.setCita(citaDto);
	        return dto;
	    }).collect(Collectors.toList());
	}
	
	@GetMapping("/facturas/{idFactura}")
	public ResponseEntity<?> getFacturaById(@PathVariable Long idFactura) {
	    try {
	        Facturas factura = facturasDAO.findById(idFactura).orElse(null);
	        if (factura == null) {
	            return ResponseEntity.notFound().build();
	        }

	        // Mapea la entidad a un DTO enriquecido
	        FacturaDTO facturaDTO = new FacturaDTO();
	        facturaDTO.setIdFactura(factura.getIdFactura());
	        facturaDTO.setFechaEmision(factura.getFechaEmision());
	        facturaDTO.setMontoTotal(factura.getMontoTotal());
	        facturaDTO.setEstadoPago(factura.getEstadoPago());

	        // Usa el mapToDTO que ya tienes para la cita
	        CitaDTO citaDTO = mapToDTO(factura.getCitas());
	        facturaDTO.setCita(citaDTO);

	        return ResponseEntity.ok(facturaDTO);
	    } catch (Exception e) {
	        Map<String, Object> response = new LinkedHashMap<>();
	        response.put("mensaje", "Error al obtener la factura");
	        response.put("error", e.getMessage());
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/citas")
	public ResponseEntity<?> saveCita(@RequestBody Citas cita) {
		try {
			if (cita.getUsuarios() == null || cita.getUsuarios().getIdUsuario() == null) {
				return ResponseEntity.badRequest().body("El campo 'usuarios.idUsuario' es obligatorio.");
			}

			if (cita.getVehiculos() == null || cita.getVehiculos().getIdVehiculo() == null) {
				return ResponseEntity.badRequest().body("El campo 'vehiculos.idVehiculo' es obligatorio.");
			}
			// Buscar usuario y vehiculo en base de datos
			Long userId = cita.getUsuarios().getIdUsuario();
			String vehiculoId = cita.getVehiculos().getMatricula();
			usuarioService.findById(userId);
			vehiculoService.findByMatricula(vehiculoId);
			if (usuarioService.findById(userId) == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario con ID: " + userId);
			}
			if (vehiculoService.findByMatricula(vehiculoId) == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body("No se encontró el vehiculo con ID: " + vehiculoId);
			}

			citasService.save(cita);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al guardar la cita");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@PostMapping("/facturas/{idFactura}/pagar")
	public ResponseEntity<Void> pagarFactura(@PathVariable Long idFactura) {
	    Facturas factura = facturasDAO.findById(idFactura).orElseThrow();
	    factura.setEstadoPago("Pagado");
	    facturasDAO.save(factura);
	    return ResponseEntity.ok().build();
	}
	@PostMapping("/citas/finalizar/{idCita}")
	public ResponseEntity<Void> finalizarCita(@PathVariable Long idCita, @RequestBody Map<String, Object> body) {
	    BigDecimal monto = new BigDecimal(body.get("montoTotal").toString());
	    citasService.finalizarCitaYGenerarFactura(idCita, monto);
	    return ResponseEntity.ok().build();
	}

	@DeleteMapping("/citas/{id}")
	public ResponseEntity<?> deleteCita(@PathVariable Long id) {
		try {
			citasService.delete(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al eliminar la cita");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/citas/{id}")
	public ResponseEntity<?> updateCita(@PathVariable Long id, @RequestBody Citas cita) {
		try {
			Citas existingCita = citasService.findById(id);
			if (existingCita == null) {
				return ResponseEntity.notFound().build();
			}

			existingCita.setDescripcion(cita.getDescripcion());
			existingCita.setEstado(cita.getEstado());
			existingCita.setFechaHora(cita.getFechaHora());
			citasService.update(existingCita);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			Map<String, Object> response = new LinkedHashMap<>();
			response.put("mensaje", "Error al actualizar la cita");
			response.put("error", e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private CitaDTO mapToDTO(Citas cita) {
		CitaDTO dto = new CitaDTO();
		dto.setIdCita(cita.getIdCita());
		dto.setDescripcion(cita.getDescripcion());
		dto.setEstado(cita.getEstado());
		dto.setFechaHora(cita.getFechaHora());
		dto.setFechaCreacion(cita.getFechaCreacion());

		UsuarioDTO usuarioDTO = new UsuarioDTO();
		usuarioDTO.setIdUsuario(cita.getUsuarios().getIdUsuario());
		usuarioDTO.setNombre(cita.getUsuarios().getNombre());
		usuarioDTO.setEmail(cita.getUsuarios().getEmail());
		usuarioDTO.setTelefono(cita.getUsuarios().getTelefono());
		usuarioDTO.setTipoUsuario(cita.getUsuarios().getTipoUsuario());
		dto.setUsuarios(usuarioDTO);

		VehiculoDTO vehiculoDTO = new VehiculoDTO();
		vehiculoDTO.setIdVehiculo(cita.getVehiculos().getIdVehiculo());
		vehiculoDTO.setMarca(cita.getVehiculos().getMarca());
		vehiculoDTO.setModelo(cita.getVehiculos().getModelo());
		vehiculoDTO.setMatricula(cita.getVehiculos().getMatricula());
		dto.setVehiculos(vehiculoDTO);

		var mecanicoCitaOpt = mecanicosCitasService.getMecanicoByCita(cita.getIdCita());
		if (mecanicoCitaOpt.isPresent()) {
			var mecanico = mecanicoCitaOpt.get().getUsuarios();
			UsuarioDTO mecanicoDTO = new UsuarioDTO();
			mecanicoDTO.setIdUsuario(mecanico.getIdUsuario());
			mecanicoDTO.setNombre(mecanico.getNombre());
			mecanicoDTO.setEmail(mecanico.getEmail());
			mecanicoDTO.setTelefono(mecanico.getTelefono());
			mecanicoDTO.setTipoUsuario(mecanico.getTipoUsuario());
			dto.setMecanico(mecanicoDTO);
		} else {
			dto.setMecanico(null);
		}

		// --- Añade el idConversacion como Long ---
		dto.setIdConversacion(cita.getConversacion() != null ? cita.getConversacion().getIdConversacion() : null);

		return dto;
	}
}
