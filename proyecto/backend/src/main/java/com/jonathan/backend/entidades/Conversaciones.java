package com.jonathan.backend.entidades;

// default package
// Generated 23 mar 2025, 19:34:28 by Hibernate Tools 4.3.6.Final

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.UniqueConstraint;

/**
 * Conversaciones generated by hbm2java
 */
@Entity
@Table(name = "conversaciones", catalog = "garagebox")
public class Conversaciones implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long idConversacion;
	private Usuarios usuariosByIdUsuario1;
	private Usuarios usuariosByIdUsuario2;
	private Date fechaCreacion;
	private Set<Mensajes> mensajeses = new HashSet<Mensajes>(0);

	public Conversaciones() {
	}

	public Conversaciones(Long idConversacion) {
		this.idConversacion = idConversacion;
	}

	public Conversaciones(Long idConversacion, Usuarios usuariosByIdUsuario1, Usuarios usuariosByIdUsuario2,
			Date fechaCreacion, Set<Mensajes> mensajeses) {
		this.idConversacion = idConversacion;
		this.usuariosByIdUsuario1 = usuariosByIdUsuario1;
		this.usuariosByIdUsuario2 = usuariosByIdUsuario2;
		this.fechaCreacion = fechaCreacion;
		this.mensajeses = mensajeses;
	}

	@Id
	@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
	@Column(name = "id_conversacion", unique = true, nullable = false)
	public Long getIdConversacion() {
		return this.idConversacion;
	}

	public void setIdConversacion(Long idConversacion) {
		this.idConversacion = idConversacion;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_usuario1")
	public Usuarios getUsuariosByIdUsuario1() {
		return this.usuariosByIdUsuario1;
	}

	public void setUsuariosByIdUsuario1(Usuarios usuariosByIdUsuario1) {
		this.usuariosByIdUsuario1 = usuariosByIdUsuario1;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_usuario2")
	public Usuarios getUsuariosByIdUsuario2() {
		return this.usuariosByIdUsuario2;
	}

	public void setUsuariosByIdUsuario2(Usuarios usuariosByIdUsuario2) {
		this.usuariosByIdUsuario2 = usuariosByIdUsuario2;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "fecha_creacion", length = 29)
	public Date getFechaCreacion() {
		return this.fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "conversaciones")
	
	public Set<Mensajes> getMensajeses() {
		return this.mensajeses;
	}

	public void setMensajeses(Set<Mensajes> mensajeses) {
		this.mensajeses = mensajeses;
	}

}
