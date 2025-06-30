package com.jonathan.backend.dto;

public class VehiculoDTO {
    private Long idVehiculo;
    private String marca;
    private String modelo;
    private String matricula;
    private Integer anoFabricacion;
    private String tipoMotor;

    // Getters y setters
    public Long getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(Long idVehiculo) { this.idVehiculo = idVehiculo; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public Integer getAnoFabricacion() { return anoFabricacion; }
    public void setAnoFabricacion(Integer anoFabricacion) { this.anoFabricacion = anoFabricacion; }
    public String getTipoMotor() { return tipoMotor; }
    public void setTipoMotor(String tipoMotor) { this.tipoMotor = tipoMotor; }
}