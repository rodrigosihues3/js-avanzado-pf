package com.sanisidro.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller de demostración de las librerías agregadas
 * Accede a: http://localhost:8080/api/demo/...
 */
@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "http://localhost:3000")
public class DemoController {
    
    /**
     * DEMO 1: Apache Commons Lang
     * http://localhost:8080/api/demo/commons
     */
    @GetMapping("/commons")
    public Map<String, Object> demoApacheCommons() {
        Map<String, Object> resultados = new HashMap<>();
        
        // 1. Validar si un string está vacío
        String texto1 = "   ";
        String texto2 = "Hola Mundo";
        resultados.put("1_texto_vacio_es_blank", StringUtils.isBlank(texto1)); // true
        resultados.put("1_texto_lleno_es_blank", StringUtils.isBlank(texto2)); // false
        
        // 2. Capitalizar texto
        String nombre = "juan perez";
        resultados.put("2_nombre_original", nombre);
        resultados.put("2_nombre_capitalizado", StringUtils.capitalize(nombre));
        
        // 3. Validar si es numérico
        String telefono = "923456789";
        String telefonoMalo = "923-456-789";
        resultados.put("3_telefono_valido", StringUtils.isNumeric(telefono)); // true
        resultados.put("3_telefono_invalido", StringUtils.isNumeric(telefonoMalo)); // false
        
        // 4. Truncar texto
        String descripcion = "Este es un texto muy largo que necesita ser truncado para mostrarse";
        resultados.put("4_descripcion_completa", descripcion);
        resultados.put("4_descripcion_truncada", StringUtils.abbreviate(descripcion, 30));
        
        // 5. Remover espacios
        String email = "  admin@sanisidro.com  ";
        resultados.put("5_email_con_espacios", email);
        resultados.put("5_email_limpio", StringUtils.trim(email));
        
        return resultados;
    }
    
    /**
     * DEMO 2: Google Guava Cache
     * http://localhost:8080/api/demo/guava
     */
    @GetMapping("/guava")
    public Map<String, Object> demoGuava() {
        Map<String, Object> resultado = new HashMap<>();
        
        // Crear una lista inmutable con Guava
        com.google.common.collect.ImmutableList<String> categorias = 
            com.google.common.collect.ImmutableList.of("Entradas", "Platos Fuertes", "Postres", "Bebidas");
        
        resultado.put("1_lista_inmutable", categorias);
        resultado.put("1_explicacion", "Esta lista NO se puede modificar, es segura");
        
        // Crear un mapa inmutable
        com.google.common.collect.ImmutableMap<String, Integer> precios = 
            com.google.common.collect.ImmutableMap.of(
                "Ceviche", 25,
                "Lomo Saltado", 30,
                "Aji de Gallina", 28
            );
        
        resultado.put("2_mapa_inmutable", precios);
        resultado.put("2_explicacion", "Este mapa NO se puede modificar");
        
        // Ejemplo de uso práctico
        resultado.put("3_uso_real", "En tu app: guardar configuraciones que no deben cambiar");
        resultado.put("3_ejemplo", "Horarios del restaurante, categorías del menú, etc.");
        
        return resultado;
    }
    
    /**
     * DEMO 3: Validación práctica con Commons
     * http://localhost:8080/api/demo/validar?telefono=923456789&email=admin@sanisidro.com
     */
    @GetMapping("/validar")
    public Map<String, Object> demoValidacion(
        @RequestParam(required = false) String telefono,
        @RequestParam(required = false) String email
    ) {
        Map<String, Object> resultado = new HashMap<>();
        
        // Validar teléfono
        if (telefono != null) {
            boolean esValido = StringUtils.isNumeric(telefono) && telefono.length() == 9;
            resultado.put("telefono", telefono);
            resultado.put("telefono_valido", esValido);
            resultado.put("telefono_mensaje", esValido ? "✅ Teléfono válido" : "❌ Debe ser 9 dígitos numéricos");
        }
        
        // Validar email
        if (email != null) {
            boolean esValido = StringUtils.isNotBlank(email) && email.contains("@") && email.contains(".");
            resultado.put("email", email);
            resultado.put("email_valido", esValido);
            resultado.put("email_mensaje", esValido ? "✅ Email válido" : "❌ Email inválido");
        }
        
        resultado.put("uso_real", "Esto se usa ANTES de guardar en la base de datos");
        
        return resultado;
    }
    
    /**
     * DEMO 4: Resumen
     * http://localhost:8080/api/demo/resumen
     */
    @GetMapping("/resumen")
    public Map<String, Object> resumen() {
        Map<String, Object> resultado = new HashMap<>();
        
        resultado.put("titulo", "🧪 Demos Disponibles para San Isidro Backend");
        
        Map<String, String> demos = new HashMap<>();
        demos.put("1_Apache_Commons", "http://localhost:8080/api/demo/commons");
        demos.put("2_Google_Guava", "http://localhost:8080/api/demo/guava");
        demos.put("3_Validacion", "http://localhost:8080/api/demo/validar?telefono=923456789&email=admin@sanisidro.com");
        demos.put("4_Resumen", "http://localhost:8080/api/demo/resumen");
        
        resultado.put("endpoints_disponibles", demos);
        resultado.put("instrucciones", "Abre cada URL en tu navegador para ver los resultados");
        
        Map<String, String> explicacion = new HashMap<>();
        explicacion.put("Apache_Commons", "Valida datos ANTES de guardar en BD");
        explicacion.put("Google_Guava", "Guarda datos en memoria (cache) para no consultar BD repetidamente");
        explicacion.put("Apache_POI", "Exporta datos de BD a archivos Excel");
        explicacion.put("ModelMapper", "Convierte datos de BD a formato para frontend");
        
        resultado.put("donde_se_usan", explicacion);
        
        return resultado;
    }
}
