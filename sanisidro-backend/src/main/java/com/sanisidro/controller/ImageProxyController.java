package com.sanisidro.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@RestController
@RequestMapping("/api/image-proxy")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageProxyController {

    @GetMapping
    public ResponseEntity<byte[]> getImage(@RequestParam String url) {
        try {
            // Decodificar la URL si viene en Base64
            String imageUrl = new String(Base64.getUrlDecoder().decode(url));
            
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<byte[]> response = restTemplate.getForEntity(imageUrl, byte[].class);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setCacheControl(CacheControl.maxAge(java.time.Duration.ofDays(7)));
            
            return new ResponseEntity<>(response.getBody(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
