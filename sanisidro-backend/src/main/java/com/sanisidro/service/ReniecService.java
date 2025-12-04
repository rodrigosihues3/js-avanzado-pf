package com.sanisidro.service;

import com.sanisidro.dto.ReniecResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ReniecService {

    private String apiUrl = "https://api.decolecta.com/v1/reniec/dni";
    private String apiToken = "sk_11994.hNBdNsnjy0VbwiqITQbm306tESuZi5mP";

    private final RestTemplate restTemplate = new RestTemplate();

    public ReniecResponse consultarPorDni(String dni) {
        String url = apiUrl + "?numero=" + dni;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiToken); // Authorization: Bearer <token>
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Realiza la petición GET
        ResponseEntity<ReniecResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ReniecResponse.class);

        return response.getBody();
    }
}