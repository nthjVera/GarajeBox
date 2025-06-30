package com.jonathan.backend.controllers;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jonathan.backend.dto.MensajeChatDTO;
import com.jonathan.backend.entidades.Mensajes;
import com.jonathan.backend.services.MensajesService;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajesController {

    @Autowired
    private MensajesService mensajesService;

    @GetMapping("/conversacion/{idConversacion}")
    public ResponseEntity<List<MensajeChatDTO>> getMensajesByConversacion(@PathVariable Long idConversacion) {
        List<Mensajes> mensajes = mensajesService.findAll().stream()
            .filter(m -> m.getConversaciones().getIdConversacion().equals(idConversacion))
            .sorted(Comparator.comparing(Mensajes::getFechaEnvio))
            .collect(Collectors.toList());

        List<MensajeChatDTO> dtos = mensajes.stream().map(m -> {
            MensajeChatDTO dto = new MensajeChatDTO();
            dto.setIdMensaje(m.getIdMensaje());
            dto.setIdConversacion(m.getConversaciones().getIdConversacion());
            dto.setIdRemitente(m.getUsuarios().getIdUsuario());
            dto.setContenido(m.getContenido());
            dto.setFechaEnvio(m.getFechaEnvio());
            dto.setLeido(m.getLeido() != null ? m.getLeido() : false);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    @PostMapping("/marcar-leidos")
    public ResponseEntity<?> marcarMensajesLeidos(@RequestBody Map<String, List<Long>> body) {
        List<Long> ids = body.get("ids");
        mensajesService.marcarComoLeidos(ids);
        return ResponseEntity.ok().build();
    }
}
