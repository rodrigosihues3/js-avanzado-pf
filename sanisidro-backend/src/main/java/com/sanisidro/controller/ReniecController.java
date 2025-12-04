package com.sanisidro.controller;

import com.sanisidro.dto.ReniecResponse;
import com.sanisidro.service.ReniecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reniec")
@CrossOrigin(originPatterns = "*") // Permite al frontend local
public class ReniecController {

  @Autowired
  private ReniecService reniecService;

  @GetMapping("/consulta/{dni}")
  public ResponseEntity<ReniecResponse> consultarDni(@PathVariable String dni) {
    try {
      ReniecResponse datos = reniecService.consultarPorDni(dni);
      return ResponseEntity.ok(datos);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build(); // O manejar error 404/500
    }
  }
}