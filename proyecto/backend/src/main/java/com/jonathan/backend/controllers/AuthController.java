package com.jonathan.backend.controllers;

import java.util.Map;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jonathan.backend.dto.UsuarioDTO;
import com.jonathan.backend.entidades.Usuarios;
import com.jonathan.backend.services.UsuarioService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "*" })
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuarios usuario) {
        try {
            // Cifrar la contraseña antes de guardar
            String hashed = BCrypt.hashpw(usuario.getContrasena(), BCrypt.gensalt());
            usuario.setContrasena(hashed);
            usuarioService.save(usuario);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuarios usuario) {
        Usuarios user = usuarioService.findByEmail(usuario.getEmail());
        if (user != null && BCrypt.checkpw(usuario.getContrasena(), user.getContrasena())) {
            UsuarioDTO dto = new UsuarioDTO();
            dto.setIdUsuario(user.getIdUsuario());
            dto.setNombre(user.getNombre());
            dto.setEmail(user.getEmail());
            dto.setTelefono(user.getTelefono());
            dto.setTipoUsuario(user.getTipoUsuario());
            dto.setFotoPerfil(user.getFotoPerfil());
            dto.setToken(user.getToken());
            dto.setFechaRegistro(user.getFechaRegistro());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Credenciales incorrectas"));
        }
    }
}