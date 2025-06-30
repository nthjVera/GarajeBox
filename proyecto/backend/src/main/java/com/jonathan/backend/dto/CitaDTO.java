package com.jonathan.backend.dto;

import java.util.Date;

public class CitaDTO {
    private Long idCita;
    private UsuarioDTO usuarios;
    private VehiculoDTO vehiculos;
    private UsuarioDTO mecanico; // Puede ser null si no hay mecánico asignado
    private Long idConversacion; // ID de la conversación
    private Date fechaHora;
    private String descripcion;
    private String estado;
    private Date fechaCreacion;

    // Getters y setters
    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public UsuarioDTO getUsuarios() { return usuarios; }
    public void setUsuarios(UsuarioDTO usuarios) { this.usuarios = usuarios; }
    public VehiculoDTO getVehiculos() { return vehiculos; }
    public void setVehiculos(VehiculoDTO vehiculos) { this.vehiculos = vehiculos; }
    public UsuarioDTO getMecanico() { return mecanico; }
    public void setMecanico(UsuarioDTO mecanico) { this.mecanico = mecanico; }
    public Date getFechaHora() { return fechaHora; }
    public void setFechaHora(Date fechaHora) { this.fechaHora = fechaHora; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Date getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Date fechaCreacion) { this.fechaCreacion = fechaCreacion; }
	public Long getIdConversacion() {
		return idConversacion;
	}
	public void setIdConversacion(Long idConversacion) {
		this.idConversacion = idConversacion;
	}
}