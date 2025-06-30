package com.jonathan.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jonathan.backend.dto.MecanicosCitasDTO;
import com.jonathan.backend.dto.UsuarioDTO;
import com.jonathan.backend.entidades.MecanicosCitas;
import com.jonathan.backend.services.MecanicosCitasService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/mecanicos_citas")
@CrossOrigin(origins = "*")
public class MecanicosCitasController {

    @Autowired
    private MecanicosCitasService mecanicosCitasService;

    // Asignar mecánico a cita
    @PostMapping("/asignar")
    public ResponseEntity<MecanicosCitas> asignarMecanico(@RequestBody Map<String, Object> body) {
        
    	Long idCita = Long.valueOf(body.get("idCita").toString());
        Long idMecanico = Long.valueOf(body.get("idMecanico").toString());
        MecanicosCitas mc = mecanicosCitasService.asignarMecanico(idCita, idMecanico);
        return ResponseEntity.ok(mc);
    }

    // Obtener mecánico asignado a una cita (devuelve DTO)
    @GetMapping("/cita/{idCita}")
    public ResponseEntity<MecanicosCitasDTO> getMecanicoByCita(@PathVariable Long idCita) {
        Optional<MecanicosCitas> mcOpt = mecanicosCitasService.getMecanicoByCita(idCita);
        if (mcOpt.isPresent()) {
            MecanicosCitas mc = mcOpt.get();
            MecanicosCitasDTO dto = new MecanicosCitasDTO();
            dto.setIdCita(mc.getId().getIdCita());
            dto.setIdMecanico(mc.getId().getIdMecanico());
            // Mapear el mecánico a UsuarioDTO
            UsuarioDTO mecanicoDTO = new UsuarioDTO();
            mecanicoDTO.setIdUsuario(mc.getUsuarios().getIdUsuario());
            mecanicoDTO.setNombre(mc.getUsuarios().getNombre());
            mecanicoDTO.setEmail(mc.getUsuarios().getEmail());
            mecanicoDTO.setTelefono(mc.getUsuarios().getTelefono());
            mecanicoDTO.setTipoUsuario(mc.getUsuarios().getTipoUsuario());
            dto.setMecanico(mecanicoDTO);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Desasignar mecánico de cita
    @DeleteMapping("/cita/{idCita}/mecanico/{idMecanico}")
    public ResponseEntity<Void> desasignarMecanico(@PathVariable Long idCita, @PathVariable Long idMecanico) {
        mecanicosCitasService.desasignarMecanico(idCita, idMecanico);
        return ResponseEntity.noContent().build();
    }
}