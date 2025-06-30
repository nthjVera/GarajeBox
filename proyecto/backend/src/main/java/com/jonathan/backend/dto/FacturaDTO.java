package com.jonathan.backend.dto;

import java.math.BigDecimal;
import java.util.Date;

public class FacturaDTO {
    private Long idFactura;
    private Date fechaEmision;
    private BigDecimal montoTotal;
    private String estadoPago;
    private CitaDTO cita;
	public Long getIdFactura() {
		return idFactura;
	}
	public void setIdFactura(Long idFactura) {
		this.idFactura = idFactura;
	}
	public Date getFechaEmision() {
		return fechaEmision;
	}
	public void setFechaEmision(Date fechaEmision) {
		this.fechaEmision = fechaEmision;
	}
	public BigDecimal getMontoTotal() {
		return montoTotal;
	}
	public void setMontoTotal(BigDecimal bigDecimal) {
		this.montoTotal = bigDecimal;
	}
	public String getEstadoPago() {
		return estadoPago;
	}
	public void setEstadoPago(String estadoPago) {
		this.estadoPago = estadoPago;
	}
	public CitaDTO getCita() {
		return cita;
	}
	public void setCita(CitaDTO cita) {
		this.cita = cita;
	}

    
}