package com.sanisidro.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "promociones")
public class Promocion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String descripcion;
    
    @Column(nullable = false)
    private Double descuento;
    
    @Column(name = "tipo_promocion")
    private String tipoPromocion = "general";
    
    @Column(name = "productos_aplicables", length = 500)
    private String productosAplicables;
    
    @Column(name = "monto_minimo")
    private Double montoMinimo = 0.0;
    
    @Column(name = "cantidad_minima")
    private Integer cantidadMinima = 0;
    
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;
    
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
    
    private Boolean activa = true;
    
    @Column(length = 500)
    private String imagen;
    
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
