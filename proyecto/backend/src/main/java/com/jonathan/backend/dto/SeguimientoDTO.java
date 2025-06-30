package com.jonathan.backend.dto;

import java.util.Date;

public class SeguimientoDTO {
    private Long idSeguimiento;
    private Long idCita;
    private String descripcion;
    private String imagenUrl;
    private String estado;
    private Date fechaActualizacion;

    // Getters y setters
    public Long getIdSeguimiento() { return idSeguimiento; }
    public void setIdSeguimiento(Long idSeguimiento) { this.idSeguimiento = idSeguimiento; }
    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Date getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(Date fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}