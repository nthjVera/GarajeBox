package com.jonathan.backend.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.IConversacionesDAO;
import com.jonathan.backend.dao.IMensajesDAO;
import com.jonathan.backend.dao.IUsuariosDAO;
import com.jonathan.backend.dto.MensajeChatDTO;
import com.jonathan.backend.entidades.Conversaciones;
import com.jonathan.backend.entidades.Mensajes;
import com.jonathan.backend.entidades.Usuarios;

@Service
public class ChatService {
    @Autowired
    private IMensajesDAO mensajesRepository;
    @Autowired
    private IConversacionesDAO conversacionesRepository;
    @Autowired
    private IUsuariosDAO usuariosRepository;

    @Transactional
    public Mensajes guardarMensaje(MensajeChatDTO dto) {
        Conversaciones conversacion = conversacionesRepository.findById(dto.getIdConversacion()).orElseThrow();
        Usuarios remitente = usuariosRepository.findById(dto.getIdRemitente()).orElseThrow();

        Mensajes mensaje = new Mensajes();
        mensaje.setConversaciones(conversacion);
        mensaje.setUsuarios(remitente);
        mensaje.setContenido(dto.getContenido());
        mensaje.setFechaEnvio(new Date());
        mensaje.setLeido(false);

        return mensajesRepository.save(mensaje);
    }
}