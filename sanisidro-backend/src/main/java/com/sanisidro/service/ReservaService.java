package com.sanisidro.service;

import com.sanisidro.model.Reserva;
import com.sanisidro.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservaService {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    public List<Reserva> obtenerTodas() {
        return reservaRepository.findAll();
    }
    
    public Reserva obtenerPorId(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }
    
    public List<Reserva> obtenerPorEmail(String email) {
        return reservaRepository.findByEmailOrderByFechaDesc(email);
    }
    
    public List<Reserva> obtenerPorFecha(LocalDate fecha) {
        return reservaRepository.findByFecha(fecha);
    }
    
    public List<Reserva> obtenerPorEstado(String estado) {
        return reservaRepository.findByEstado(estado);
    }
    
    public Reserva crear(Reserva reserva) {
        return reservaRepository.save(reserva);
    }
    
    public Reserva actualizar(Long id, Reserva reserva) {
        if (reservaRepository.existsById(id)) {
            reserva.setId(id);
            return reservaRepository.save(reserva);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        reservaRepository.deleteById(id);
    }
}
