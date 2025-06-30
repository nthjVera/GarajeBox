package com.jonathan.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.jonathan.backend.dto.MensajeChatDTO;
import com.jonathan.backend.entidades.Mensajes;
import com.jonathan.backend.services.ChatService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void enviarMensaje(MensajeChatDTO mensaje) {
        Mensajes saved = chatService.guardarMensaje(mensaje);
        // Mapea a DTO si es necesario
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.setIdMensaje(saved.getIdMensaje());
        dto.setIdConversacion(saved.getConversaciones().getIdConversacion());
        dto.setIdRemitente(saved.getUsuarios().getIdUsuario());
        dto.setContenido(saved.getContenido());
        dto.setFechaEnvio(saved.getFechaEnvio());
        messagingTemplate.convertAndSend("/topic/chat/" + dto.getIdConversacion(), dto);
    }
}