package com.sanisidro.dto;

import java.time.LocalDateTime;

/**
 * DTO (Data Transfer Object) para Pedido
 * 
 * Diferencia con el Entity Pedido:
 * - Entity: Tiene TODOS los campos de la BD (incluso datos sensibles)
 * - DTO: Solo tiene los campos que el frontend necesita ver
 * 
 * Ejemplo:
 * - Entity Pedido puede tener: password, token_seguridad, etc.
 * - DTO solo envía: id, cliente, total, estado
 */
public class PedidoDTO {
    private Long id;
    private String nombreCliente;
    private String telefono;
    private Double total;
    private String estado;
    private LocalDateTime fechaCreacion;
    
    // Constructor vacío
    public PedidoDTO() {
    }
    
    // Constructor con parámetros
    public PedidoDTO(Long id, String nombreCliente, String telefono, 
                     Double total, String estado, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombreCliente = nombreCliente;
        this.telefono = telefono;
        this.total = total;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombreCliente() {
        return nombreCliente;
    }
    
    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
