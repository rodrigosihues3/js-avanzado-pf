package com.sanisidro.dto;

/**
 * DTO (Data Transfer Object) para Producto
 * 
 * ¿Para qué sirve?
 * - Enviar solo los datos necesarios al frontend
 * - No exponer toda la información de la base de datos
 * - Separar la capa de presentación de la capa de datos
 */
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String categoria;
    private String imagen;
    private Boolean disponible;
    
    // Constructor vacío
    public ProductoDTO() {
    }
    
    // Constructor con parámetros
    public ProductoDTO(Long id, String nombre, String descripcion, Double precio, 
                       String categoria, String imagen, Boolean disponible) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
        this.disponible = disponible;
    }
    
    // Getters y Setters (sin Lombok)
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public Double getPrecio() {
        return precio;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public String getCategoria() {
        return categoria;
    }
    
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    
    public String getImagen() {
        return imagen;
    }
    
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
    
    public Boolean getDisponible() {
        return disponible;
    }
    
    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
