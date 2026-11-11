package com.example.iot.controller;

import com.example.iot.service.VirtualSensorService;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/virtual-sensors")
public class VirtualSensorController {
    private final VirtualSensorService service;

    public VirtualSensorController(VirtualSensorService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, Object> statistics(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return service.getStatistics(date == null ? LocalDate.now() : date);
    }
}
