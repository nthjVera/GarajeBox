package com.jonathan.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jonathan.backend.dao.IUsuariosDAO;
import com.jonathan.backend.entidades.Usuarios;

@Service
public class UsuarioService {

	@Autowired
	private IUsuariosDAO usuariosDAO;

	@Transactional(readOnly = true)
	public List<Usuarios> findAll() {
		return usuariosDAO.findAll();
	}

	@Transactional(readOnly = true)
	public Usuarios findByEmail(String Email) {
		return usuariosDAO.findByEmail(Email);
	}
	@Transactional(readOnly = true)
	public Usuarios findById(Long id) {
		return usuariosDAO.findById(id).orElse(null);
	}

	@Transactional
	public void save(Usuarios usuario) {
		usuariosDAO.save(usuario);
	}
	

	@Transactional
	public void delete(Long id) {
		usuariosDAO.deleteById(id);
	}

}
