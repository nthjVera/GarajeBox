package com.jonathan.backend.dto;

import java.util.Date;

public class MensajeChatDTO {
    private Long idMensaje;
    private Long idConversacion;
    private Long idRemitente;
    private String contenido;
    private Date fechaEnvio;
    private Boolean leido;

    // Getters y setters
    public Long getIdMensaje() { return idMensaje; }
    public void setIdMensaje(Long idMensaje) { this.idMensaje = idMensaje; }
    public Long getIdConversacion() { return idConversacion; }
    public void setIdConversacion(Long idConversacion) { this.idConversacion = idConversacion; }
    public Long getIdRemitente() { return idRemitente; }
    public void setIdRemitente(Long idRemitente) { this.idRemitente = idRemitente; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Date getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(Date fechaEnvio) { this.fechaEnvio = fechaEnvio; }
	public Boolean getLeido() {
		return leido;
	}
	public void setLeido(Boolean leido) {
		this.leido = leido;
	}
}