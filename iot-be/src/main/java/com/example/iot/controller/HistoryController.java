package com.example.iot.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.iot.entity.History;
import com.example.iot.service.HistoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor 
@RestController 
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/history")
public class HistoryController {

    HistoryService historyService;

    @GetMapping("/all")
    public Page<History> getAllHistory(
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ) {
        return historyService.getAllHistory(PageRequest.of(page, size));
    } 
    
    @GetMapping("/search/device-name")
    public Page<History> getHistoryByDeviceName(@RequestParam String name, 
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ){
        return historyService.getHistoryByDeviceName(name, PageRequest.of(page, size));
    }

    @GetMapping("/search/date")
    public Page<History> getHistoryByDate(@RequestParam LocalDate date,
        @RequestParam (name = "page", defaultValue = "0") int page,
        @RequestParam (name = "size", defaultValue = "10") int size
    ) {
        return historyService.getHistoryByDate(date, PageRequest.of(page, size));
    }
}
