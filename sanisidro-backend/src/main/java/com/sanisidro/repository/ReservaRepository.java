package com.sanisidro.repository;

import com.sanisidro.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByEmail(String email);
    List<Reserva> findByFecha(LocalDate fecha);
    List<Reserva> findByEstado(String estado);
    List<Reserva> findByEmailOrderByFechaDesc(String email);
}
