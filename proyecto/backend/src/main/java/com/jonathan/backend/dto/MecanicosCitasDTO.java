package com.jonathan.backend.dto;

public class MecanicosCitasDTO {
    private Long idCita;
    private Long idMecanico;
    private UsuarioDTO mecanico;

    // Getters y setters
    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public Long getIdMecanico() { return idMecanico; }
    public void setIdMecanico(Long idMecanico) { this.idMecanico = idMecanico; }
    public UsuarioDTO getMecanico() { return mecanico; }
    public void setMecanico(UsuarioDTO mecanico) { this.mecanico = mecanico; }
}