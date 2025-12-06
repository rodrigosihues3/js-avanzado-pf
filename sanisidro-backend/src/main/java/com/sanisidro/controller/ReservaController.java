package com.sanisidro.controller;

import com.sanisidro.model.Reserva;
import com.sanisidro.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(originPatterns = "*")
public class ReservaController {
    
    @Autowired
    private ReservaService reservaService;
    
    @GetMapping
    public List<Reserva> obtenerTodas() {
        return reservaService.obtenerTodas();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtenerPorId(@PathVariable Long id) {
        Reserva reserva = reservaService.obtenerPorId(id);
        return reserva != null ? ResponseEntity.ok(reserva) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/usuario/{email}")
    public List<Reserva> obtenerPorEmail(@PathVariable String email) {
        return reservaService.obtenerPorEmail(email);
    }
    
    @GetMapping("/fecha/{fecha}")
    public List<Reserva> obtenerPorFecha(@PathVariable String fecha) {
        return reservaService.obtenerPorFecha(LocalDate.parse(fecha));
    }
    
    @GetMapping("/estado/{estado}")
    public List<Reserva> obtenerPorEstado(@PathVariable String estado) {
        return reservaService.obtenerPorEstado(estado);
    }
    
    @PostMapping
    public Reserva crear(@RequestBody Reserva reserva) {
        return reservaService.crear(reserva);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Reserva> actualizar(@PathVariable Long id, @RequestBody Reserva reserva) {
        Reserva actualizada = reservaService.actualizar(id, reserva);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reservaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
