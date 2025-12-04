package com.sanisidro.service;

import com.sanisidro.model.Promocion;
import com.sanisidro.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PromocionService {
    
    @Autowired
    private PromocionRepository promocionRepository;
    
    public List<Promocion> obtenerTodas() {
        return promocionRepository.findAll();
    }
    
    public Promocion obtenerPorId(Long id) {
        return promocionRepository.findById(id).orElse(null);
    }
    
    public Promocion obtenerPorCodigo(String codigo) {
        return promocionRepository.findByCodigo(codigo).orElse(null);
    }
    
    public Promocion crear(Promocion promocion) {
        return promocionRepository.save(promocion);
    }
    
    public Promocion actualizar(Long id, Promocion promocion) {
        if (promocionRepository.existsById(id)) {
            promocion.setId(id);
            return promocionRepository.save(promocion);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }
}
