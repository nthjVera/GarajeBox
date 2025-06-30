package com.jonathan.backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.jonathan.backend.dto.SeguimientoDTO;
import com.jonathan.backend.entidades.Citas;
import com.jonathan.backend.entidades.Seguimiento;
import com.jonathan.backend.services.CitasService;
import com.jonathan.backend.services.SeguiminetoService;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(origins = "*")
public class SeguimientoController {

    @Autowired
    private SeguiminetoService seguimientoService;

    @Autowired
    private CitasService citasService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/cita/{idCita}")
    public ResponseEntity<List<SeguimientoDTO>> getSeguimientosByCita(@PathVariable Long idCita) {
        List<Seguimiento> seguimientos = seguimientoService.obtenerSeguimientosPorCita(idCita);
        List<SeguimientoDTO> dtos = seguimientos.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<SeguimientoDTO> createSeguimiento(@RequestBody Seguimiento seguimiento) {
        Seguimiento createdSeguimiento = seguimientoService.createSeguimiento(seguimiento);
        SeguimientoDTO dto = mapToDTO(createdSeguimiento);
        notificarSeguimiento(createdSeguimiento);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<SeguimientoDTO>> createMultipleSeguimientos(@RequestBody List<SeguimientoDTO> seguimientos) {
        List<SeguimientoDTO> result = seguimientos.stream()
            .map(dto -> {
                Seguimiento seguimiento = new Seguimiento();
                seguimiento.setDescripcion(dto.getDescripcion());
                seguimiento.setEstado(dto.getEstado());
                seguimiento.setFechaActualizacion(dto.getFechaActualizacion());
                if (dto.getIdCita() != null) {
                    Citas cita = citasService.findById(dto.getIdCita());
                    seguimiento.setCitas(cita);
                }
                Seguimiento creado = seguimientoService.createSeguimiento(seguimiento);
                notificarSeguimiento(creado);
                return mapToDTO(creado);
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{idSeguimiento}")
    public ResponseEntity<?> updateSeguimiento(@PathVariable Long idSeguimiento, @RequestBody SeguimientoDTO seguimiento) {
        Seguimiento updatedSeguimiento = seguimientoService.updateSeguimiento(idSeguimiento, seguimiento);
        notificarSeguimiento(updatedSeguimiento);
        return ResponseEntity.ok(mapToDTO(updatedSeguimiento));
    }

    @PutMapping("/multiple")
    public ResponseEntity<?> updateMultipleSeguimientos(@RequestBody List<SeguimientoDTO> seguimientos) {
        for (SeguimientoDTO dto : seguimientos) {
            Seguimiento seguimiento = seguimientoService.obtenerSeguimientoPorId(dto.getIdSeguimiento());
            if (seguimiento != null) {
                seguimiento.setDescripcion(dto.getDescripcion());
                seguimiento.setEstado(dto.getEstado());
                seguimiento.setFechaActualizacion(dto.getFechaActualizacion());
                if (dto.getIdCita() != null) {
                    Citas cita = citasService.findById(dto.getIdCita());
                    seguimiento.setCitas(cita);
                }
                Seguimiento actualizado = seguimientoService.createSeguimiento(seguimiento);
                notificarSeguimiento(actualizado);
            }
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idSeguimiento}")
    public ResponseEntity<Void> deleteSeguimiento(@PathVariable Long idSeguimiento) {
        Seguimiento seguimiento = seguimientoService.obtenerSeguimientoPorId(idSeguimiento);
        if (seguimiento != null) {
            seguimientoService.deleteSeguimiento(idSeguimiento);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Utilidad para mapear entidad a DTO
    private SeguimientoDTO mapToDTO(Seguimiento seguimiento) {
        SeguimientoDTO dto = new SeguimientoDTO();
        dto.setIdSeguimiento(seguimiento.getIdSeguimiento());
        dto.setIdCita(seguimiento.getCitas().getIdCita());
        dto.setDescripcion(seguimiento.getDescripcion());
        dto.setImagenUrl(seguimiento.getImagenUrl());
        dto.setEstado(seguimiento.getEstado());
        dto.setFechaActualizacion(seguimiento.getFechaActualizacion());
        return dto;
    }

    // Notifica por WebSocket a todos los clientes de la cita
    private void notificarSeguimiento(Seguimiento seguimiento) {
        Long idCita = seguimiento.getCitas().getIdCita();
        SeguimientoDTO dto = mapToDTO(seguimiento);
        messagingTemplate.convertAndSend("/topic/seguimiento/" + idCita, dto);
    }
}