# DTOs (Data Transfer Objects)

## ¿Qué son los DTOs?

Los DTOs son objetos que se usan para **transferir datos** entre diferentes capas de la aplicación, especialmente entre el backend y el frontend.

## ¿Por qué usar DTOs?

### ❌ Sin DTO (malo):
```java
// Envías TODO el objeto de la BD al frontend
return pedido; // Incluye password, tokens, datos sensibles
```

### ✅ Con DTO (bueno):
```java
// Solo envías lo que el frontend necesita
PedidoDTO dto = new PedidoDTO();
dto.setId(pedido.getId());
dto.setNombreCliente(pedido.getNombreCliente());
dto.setTotal(pedido.getTotal());
return dto; // NO incluye datos sensibles
```

## Ejemplo práctico en San Isidro:

### Entity (Base de Datos):
```java
@Entity
public class Pedido {
    private Long id;
    private String nombreCliente;
    private String telefono;
    private String email;
    private String password;           // ← Sensible
    private String tokenSeguridad;     // ← Sensible
    private String numeroTarjeta;      // ← Sensible
    private Double total;
    private String estado;
}
```

### DTO (Para el Frontend):
```java
public class PedidoDTO {
    private Long id;
    private String nombreCliente;
    private String telefono;
    private Double total;
    private String estado;
    // NO incluye password, token, ni tarjeta ✅
}
```

## Ventajas:

1. **Seguridad**: No expones datos sensibles
2. **Performance**: Envías menos datos por la red
3. **Flexibilidad**: Puedes cambiar la BD sin afectar el frontend
4. **Claridad**: El frontend solo ve lo que necesita

## Cómo usar en tu proyecto:

```java
@GetMapping("/pedidos")
public List<PedidoDTO> obtenerPedidos() {
    List<Pedido> pedidos = pedidoService.obtenerTodos();
    
    // Convertir Entity a DTO
    List<PedidoDTO> dtos = new ArrayList<>();
    for (Pedido pedido : pedidos) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setNombreCliente(pedido.getNombreCliente());
        dto.setTotal(pedido.getTotal());
        dtos.add(dto);
    }
    
    return dtos; // Frontend solo recibe datos seguros
}
```

## DTOs disponibles en este proyecto:

- `ProductoDTO.java` - Para productos del menú
- `PedidoDTO.java` - Para pedidos de clientes

Puedes crear más DTOs según necesites.
