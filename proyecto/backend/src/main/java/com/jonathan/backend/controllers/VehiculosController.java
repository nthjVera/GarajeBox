package com.jonathan.backend.controllers;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jonathan.backend.dto.VehiculoDTO;
import com.jonathan.backend.entidades.Usuarios;
import com.jonathan.backend.entidades.Vehiculos;
import com.jonathan.backend.services.UsuarioService;
import com.jonathan.backend.services.VehiculoService;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "*")
public class VehiculosController {

    @Autowired
    private VehiculoService vehiculoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<VehiculoDTO>> getAllVehiculos() {
        List<VehiculoDTO> vehiculosDTO = vehiculoService.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(vehiculosDTO);
    }

    @GetMapping("/matricula/{matricula}")
    public ResponseEntity<VehiculoDTO> findByMatricula(@PathVariable String matricula) {
        VehiculoDTO vehiculo = vehiculoService.findByMatricula(matricula);
        if (vehiculo != null) {
            return ResponseEntity.ok(vehiculo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getVehiculoByUsuarioId(@PathVariable Long id) {
        try {
            List<VehiculoDTO> vehiculosDTO = vehiculoService.findByUsuarioId(id).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(vehiculosDTO);
        } catch (Exception e) {
            return errorResponse("Error al obtener los vehículos del usuario", "/api/vehiculos/usuario/" + id, e);
        }
    }

    @PostMapping
    public ResponseEntity<?> saveVehiculo(@RequestBody Vehiculos vehiculo) {
        try {
            if (vehiculo.getUsuarios() == null || vehiculo.getUsuarios().getIdUsuario() == null) {
                return ResponseEntity.badRequest().body("El campo 'usuarios.idUsuario' es obligatorio.");
            }
            Long userId = vehiculo.getUsuarios().getIdUsuario();
            Usuarios usuarioExistente = usuarioService.findById(userId);
            if (usuarioExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario con ID: " + userId);
            }
            vehiculo.setUsuarios(usuarioExistente);
            vehiculoService.save(vehiculo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return errorResponse("Error al guardar el vehículo", "/api/vehiculos", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehiculo(@PathVariable Long id, @RequestBody Vehiculos vehiculo) {
        try {
            if (vehiculo.getUsuarios() == null || vehiculo.getUsuarios().getIdUsuario() == null) {
                return ResponseEntity.badRequest().body("El campo 'usuarios.idUsuario' es obligatorio.");
            }
            Long userId = vehiculo.getUsuarios().getIdUsuario();
            Usuarios usuarioExistente = usuarioService.findById(userId);
            if (usuarioExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario con ID: " + userId);
            }
            vehiculo.setUsuarios(usuarioExistente);
            vehiculoService.save(vehiculo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return errorResponse("Error al actualizar el vehículo", "/api/vehiculos/" + id, e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehiculo(@PathVariable Long id) {
        vehiculoService.delete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/matricula/{matricula}")
    public ResponseEntity<Void> deleteVehiculoByMatricula(@PathVariable String matricula) {
        if (matricula != null && !matricula.isEmpty()) {
            vehiculoService.deleteByMatricula(matricula);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    // Utilidad para mapear entidad a DTO
    private VehiculoDTO mapToDTO(Vehiculos vehiculo) {
        VehiculoDTO dto = new VehiculoDTO();
        dto.setIdVehiculo(vehiculo.getIdVehiculo());
        dto.setMarca(vehiculo.getMarca());
        dto.setModelo(vehiculo.getModelo());
        dto.setMatricula(vehiculo.getMatricula());
        dto.setAnoFabricacion(vehiculo.getAnoFabricacion());
        dto.setTipoMotor(vehiculo.getTipoMotor());
        return dto;
    }

    private ResponseEntity<?> errorResponse(String mensaje, String path, Exception e) {
        Map<String, Object> errorBody = new LinkedHashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorBody.put("error", "Error interno del servidor");
        errorBody.put("message", mensaje + ": " + e.getMessage());
        errorBody.put("path", path);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
    }
}