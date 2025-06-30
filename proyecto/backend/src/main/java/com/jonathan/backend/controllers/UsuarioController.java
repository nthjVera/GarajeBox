package com.jonathan.backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jonathan.backend.dto.UsuarioDTO;
import com.jonathan.backend.entidades.Usuarios;
import com.jonathan.backend.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        List<UsuarioDTO> usuariosDTO = usuarioService.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Long id) {
        Usuarios usuario = usuarioService.findById(id);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapToDTO(usuario));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> getUsuarioByEmail(@PathVariable String email) {
        Usuarios usuario = usuarioService.findByEmail(email);
        if (usuario == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapToDTO(usuario));
    }

    @PutMapping("/{id}")
	public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
		Usuarios usuario = usuarioService.findById(id);
		if (usuario == null)
			return ResponseEntity.notFound().build();

		// Actualizar los campos del usuario
		usuario.setNombre(usuarioDTO.getNombre());
		usuario.setEmail(usuarioDTO.getEmail());
		usuario.setTelefono(usuarioDTO.getTelefono());
		usuario.setTipoUsuario(usuarioDTO.getTipoUsuario());
		usuario.setFotoPerfil(usuarioDTO.getFotoPerfil());
		usuario.setToken(usuarioDTO.getToken());
		usuario.setFechaRegistro(usuarioDTO.getFechaRegistro());

		usuarioService.save(usuario);
		return ResponseEntity.ok(mapToDTO(usuario));
	}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Utilidad para mapear entidad a DTO
    private UsuarioDTO mapToDTO(Usuarios usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setContrasena(usuario.getContrasena());
        dto.setTelefono(usuario.getTelefono());
        dto.setTipoUsuario(usuario.getTipoUsuario());
        dto.setFotoPerfil(usuario.getFotoPerfil());
        dto.setToken(usuario.getToken());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        return dto;
    }
}