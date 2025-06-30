package com.jonathan.backend.services;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.ICitasDAO;
import com.jonathan.backend.dao.IConversacionesDAO;
import com.jonathan.backend.dao.IFacturasDAO;
import com.jonathan.backend.dao.ISeguimientoDAO;
import com.jonathan.backend.entidades.Citas;
import com.jonathan.backend.entidades.Conversaciones;
import com.jonathan.backend.entidades.Facturas;
import com.jonathan.backend.entidades.Seguimiento;
import com.jonathan.backend.entidades.Usuarios;

@Service
public class CitasService {

    @Autowired
    private ICitasDAO citasDAO;

    @Autowired
    private ISeguimientoDAO seguimientoDAO;
    
    @Autowired
    private IConversacionesDAO conversacionesDAO;
  
    @Autowired
    private IFacturasDAO facturasDAO;

    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<Citas> findAll() {
        return citasDAO.findAll();
    }

    @Transactional(readOnly = true)
    public Citas findById(Long id) {
        return citasDAO.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Citas> findByUsuarioId(Long idUsuario) {
        return citasDAO.findByUsuariosIdUsuario(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Citas> findByVehiculoId(Long idVehiculo) {
        return citasDAO.findByVehiculosIdVehiculo(idVehiculo);
    }

    @Transactional
    public void save(Citas cita) {
    	
		Conversaciones conversacion = null;
		// Establecer fecha de creación
    	 cita.setFechaCreacion(new Date());

    	    // Crear conversación entre usuario y mecánico (si hay mecánico asignado)
    	    Usuarios usuario1 = cita.getUsuarios();
    	    Usuarios usuario2 = null;
    	    if (cita.getMecanicosCitases() != null && !cita.getMecanicosCitases().isEmpty()) {
    	        // Si tienes la relación, obtén el mecánico asignado
    	        usuario2 = cita.getMecanicosCitases().iterator().next().getUsuarios();
    	    }
    	    // Si no hay mecánico, puedes poner usuario2 = usuario1 (o null)
    	    if (usuario2 == null) usuario2 = usuario1;

    	 // En tu servicio antes de crear una conversación:
    	    Optional<Conversaciones> existente = conversacionesDAO
    	        .findByUsuariosByIdUsuario1AndUsuariosByIdUsuario2OrUsuariosByIdUsuario1AndUsuariosByIdUsuario2(usuario1, usuario2, usuario2, usuario1);

    	    if (existente.isPresent()) {
    	        conversacion = existente.get();
    	    } else {
    	        conversacion = new Conversaciones();
    	        conversacion.setUsuariosByIdUsuario1(usuario1);
    	        conversacion.setUsuariosByIdUsuario2(usuario2);
    	        conversacion.setFechaCreacion(new Date());
    	        conversacionesDAO.save(conversacion);
    	    }

    	    cita.setConversacion(conversacion);

    	    citasDAO.save(cita);

        // Crear un seguimiento inicial asociado a la cita
        Seguimiento seguimiento = new Seguimiento();
        seguimiento.setCitas(cita); // Relacionar el seguimiento con la cita
        seguimiento.setDescripcion("Recogida de coche para mantenimiento"); // Descripción inicial del seguimiento");
        seguimiento.setEstado("En Proceso"); // Estado inicial del seguimiento
        seguimiento.setFechaActualizacion(new Date()); // Fecha de actualización inicial);

        // Guardar el seguimiento
        seguimientoDAO.save(seguimiento);
        
     // Notificar por WebSocket a los suscritos a la cita
        messagingTemplate.convertAndSend("/topic/seguimiento/" + cita.getIdCita(), seguimiento);
    }
    
    @Transactional
	public void update(Citas cita) {
		Citas existingCita = citasDAO.findById(cita.getIdCita()).orElse(null);
		if (existingCita != null) {
			existingCita.setFechaCreacion(new Date()); // Actualizar la fecha de creación
			existingCita.setEstado(cita.getEstado());
			existingCita.setDescripcion(cita.getDescripcion());
			citasDAO.save(existingCita);
		}
	}
    @Transactional
    public void finalizarCitaYGenerarFactura(Long idCita, BigDecimal montoTotal) {
        Citas cita = citasDAO.findById(idCita).orElseThrow();
        cita.setEstado("Finalizada");
        citasDAO.save(cita);

        Facturas factura = new Facturas();
        factura.setCitas(cita);
        factura.setMontoTotal(montoTotal);
        factura.setFechaEmision(new Date());
        factura.setEstadoPago("Pendiente");
        facturasDAO.save(factura);
    }
	
    @Transactional
    public void delete(Long id) {
        citasDAO.deleteById(id);
        seguimientoDAO.deleteById(id);
    }
}