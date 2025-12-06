package com.sanisidro.controller;

import com.sanisidro.model.Promocion;
import com.sanisidro.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "*")
public class PromocionController {
    
    @Autowired
    private PromocionService promocionService;
    
    @GetMapping
    public List<Promocion> obtenerTodas() {
        return promocionService.obtenerTodas();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Promocion> obtenerPorId(@PathVariable Long id) {
        Promocion promocion = promocionService.obtenerPorId(id);
        return promocion != null ? ResponseEntity.ok(promocion) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Promocion> obtenerPorCodigo(@PathVariable String codigo) {
        Promocion promocion = promocionService.obtenerPorCodigo(codigo);
        return promocion != null ? ResponseEntity.ok(promocion) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public Promocion crear(@RequestBody Promocion promocion) {
        return promocionService.crear(promocion);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Promocion> actualizar(@PathVariable Long id, @RequestBody Promocion promocion) {
        Promocion actualizada = promocionService.actualizar(id, promocion);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
