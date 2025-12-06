package com.sanisidro.controller;

import com.sanisidro.model.Pedido;
import com.sanisidro.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @GetMapping
    public List<Pedido> obtenerTodos() {
        return pedidoService.obtenerTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/usuario/{email}")
    public List<Pedido> obtenerPorEmail(@PathVariable String email) {
        return pedidoService.obtenerPorEmail(email);
    }
    
    @GetMapping("/estado/{estado}")
    public List<Pedido> obtenerPorEstado(@PathVariable String estado) {
        return pedidoService.obtenerPorEstado(estado);
    }
    
    @PostMapping
    public Pedido crear(@RequestBody Pedido pedido) {
        System.out.println("=== CREANDO PEDIDO ===");
        System.out.println("Cliente: " + pedido.getCliente());
        System.out.println("Subtotal: " + pedido.getSubtotal());
        System.out.println("Descuento: " + pedido.getDescuento());
        System.out.println("Código Promo: " + pedido.getCodigoPromo());
        System.out.println("Total: " + pedido.getTotal());
        System.out.println("=====================");
        return pedidoService.crear(pedido);
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String estado = body.get("estado");
        System.out.println("=== ACTUALIZANDO ESTADO DE PEDIDO ===");
        System.out.println("ID del pedido: " + id);
        System.out.println("Nuevo estado: " + estado);
        
        Pedido pedidoActualizado = pedidoService.actualizarEstado(id, estado);
        if (pedidoActualizado != null) {
            System.out.println("Estado actualizado exitosamente a: " + pedidoActualizado.getEstado());
            System.out.println("=====================================");
            return ResponseEntity.ok(pedidoActualizado);
        }
        System.out.println("ERROR: Pedido no encontrado");
        System.out.println("=====================================");
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
