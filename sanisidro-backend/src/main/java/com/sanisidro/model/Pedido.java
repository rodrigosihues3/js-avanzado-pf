package com.sanisidro.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String cliente;
    
    @Column(name = "nombre_cliente")
    private String nombreCliente;
    
    private String email;
    
    private String telefono;
    
    @Column(name = "numero_factura", unique = true)
    private String numeroFactura;
    
    private LocalDate fecha = LocalDate.now();
    
    private LocalTime hora = LocalTime.now();
    
    private Double subtotal;
    
    private Double descuento = 0.0;
    
    @Column(name = "codigo_promo")
    private String codigoPromo;
    
    private Double total;
    
    @Column(nullable = false)
    private String estado = "pendiente";
    
    private String metodoPago;
    
    @Column(length = 2000)
    private String detalles;
    
    @Transient
    private java.util.List<ItemPedido> items;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
    
    // Clase interna para representar items del pedido
    @Data
    public static class ItemPedido {
        private String nombre;
        private Integer cantidad;
        private Double precio;
    }
}
