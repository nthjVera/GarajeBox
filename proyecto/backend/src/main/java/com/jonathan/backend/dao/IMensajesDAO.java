package com.jonathan.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IMensajesDAO extends JpaRepository<com.jonathan.backend.entidades.Mensajes, Long> {
	// Aquí puedes agregar métodos personalizados si es necesario
	// Por ejemplo, para buscar mensajes por remitente o conversación

}
