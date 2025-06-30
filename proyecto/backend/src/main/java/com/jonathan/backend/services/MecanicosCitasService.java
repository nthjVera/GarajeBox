package com.jonathan.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.ICitasDAO;
import com.jonathan.backend.dao.IConversacionesDAO;
import com.jonathan.backend.dao.IMecanicosCitasDAO;
import com.jonathan.backend.dao.IUsuariosDAO;
import com.jonathan.backend.entidades.Citas;
import com.jonathan.backend.entidades.Conversaciones;
import com.jonathan.backend.entidades.MecanicosCitas;
import com.jonathan.backend.entidades.MecanicosCitasId;
import com.jonathan.backend.entidades.Usuarios;

@Service
public class MecanicosCitasService {

    @Autowired
    private IMecanicosCitasDAO mecanicosCitasDAO;
    @Autowired
    private ICitasDAO citasDAO;
    @Autowired
    private IUsuariosDAO usuariosDAO;
    @Autowired
    private IConversacionesDAO conversacionesDAO;

    @Transactional
    public MecanicosCitas asignarMecanico(Long idCita, Long idMecanico) {
       
        List<Citas> citasEnProceso = citasDAO.findByEstadoAndMecanicoId("En Proceso", idMecanico);
       
        Citas cita = citasDAO.findById(idCita).orElseThrow();
        Usuarios mecanico = usuariosDAO.findById(idMecanico).orElseThrow();
        // Asignar el mecánico a la cita
        MecanicosCitasId id = new MecanicosCitasId(idMecanico, idCita);
        MecanicosCitas mc = new MecanicosCitas();
        mc.setId(id);
        mc.setCitas(cita);
        mc.setUsuarios(mecanico);
        mecanicosCitasDAO.save(mc);

        // Actualizar usuario2 de la conversación asociada a la cita
        if (cita.getConversacion() != null) {
            Conversaciones conversacion = cita.getConversacion();
            conversacion.setUsuariosByIdUsuario2(mecanico);
            conversacionesDAO.save(conversacion);
        }

        return mc;
    }

    @Transactional(readOnly = true)
    public Optional<MecanicosCitas> getMecanicoByCita(Long idCita) {
        return mecanicosCitasDAO.findByCitasIdCita(idCita);
    }

    @Transactional
    public void desasignarMecanico(Long idCita, Long idMecanico) {
        mecanicosCitasDAO.deleteByCitasIdCitaAndUsuariosIdUsuario(idCita, idMecanico);
    }
}