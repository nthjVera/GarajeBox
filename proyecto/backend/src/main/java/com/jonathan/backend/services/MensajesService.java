package com.jonathan.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.IMensajesDAO;
import com.jonathan.backend.entidades.Mensajes;

@Service
public class MensajesService {

    @Autowired
    private IMensajesDAO mensajesDAO;

    @Transactional
    public void marcarComoLeidos(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        List<Mensajes> mensajes = mensajesDAO.findAllById(ids);
        for (Mensajes m : mensajes) {
            m.setLeido(true);
        }
        mensajesDAO.saveAll(mensajes);
    }
    
    @Transactional
	public List<Mensajes> findAll() {
		return mensajesDAO.findAll();
	}
}