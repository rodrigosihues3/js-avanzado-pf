package com.sanisidro.service;

import com.sanisidro.model.Pedido;
import com.sanisidro.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    public List<Pedido> obtenerTodos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        pedidos.forEach(this::parsearItems);
        return pedidos;
    }
    
    public Optional<Pedido> obtenerPorId(Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        pedido.ifPresent(this::parsearItems);
        return pedido;
    }
    
    public List<Pedido> obtenerPorEmail(String email) {
        List<Pedido> pedidos = pedidoRepository.findByEmail(email);
        pedidos.forEach(this::parsearItems);
        return pedidos;
    }
    
    private void parsearItems(Pedido pedido) {
        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            try {
                // El campo detalles contiene un JSON con los items del carrito
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode jsonNode = mapper.readTree(pedido.getDetalles());
                
                List<Pedido.ItemPedido> items = new ArrayList<>();
                
                if (jsonNode.isArray()) {
                    for (com.fasterxml.jackson.databind.JsonNode node : jsonNode) {
                        Pedido.ItemPedido item = new Pedido.ItemPedido();
                        item.setNombre(node.get("nombre").asText());
                        item.setCantidad(node.get("cantidad").asInt());
                        item.setPrecio(node.get("precio").asDouble());
                        items.add(item);
                    }
                }
                
                pedido.setItems(items);
            } catch (Exception e) {
                System.err.println("Error parseando items del pedido " + pedido.getId() + ": " + e.getMessage());
                pedido.setItems(new ArrayList<>());
            }
        }
    }
    
    public List<Pedido> obtenerPorEstado(String estado) {
        return pedidoRepository.findByEstado(estado);
    }
    
    public Pedido crear(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    public Pedido actualizarEstado(Long id, String estado) {
        System.out.println("Servicio: Buscando pedido con ID: " + id);
        Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();
            System.out.println("Servicio: Estado anterior: " + pedido.getEstado());
            pedido.setEstado(estado);
            Pedido pedidoGuardado = pedidoRepository.save(pedido);
            System.out.println("Servicio: Estado guardado en BD: " + pedidoGuardado.getEstado());
            return pedidoGuardado;
        }
        System.out.println("Servicio: Pedido no encontrado");
        return null;
    }
    
    public void eliminar(Long id) {
        pedidoRepository.deleteById(id);
    }
}
