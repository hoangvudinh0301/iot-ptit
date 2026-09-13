package com.example.iot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.iot.entity.History;
import com.example.iot.repository.HistoryRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service 
@RequiredArgsConstructor 
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HistoryService {
    
    HistoryRepository historyRepository;
    public Page<History> getAllHistory(Pageable pageable) {
        return historyRepository.findAll(pageable);
    }

    public Page<History> getHistoryByDeviceName(String deviceName, Pageable pageable) {
        return historyRepository.searchHistoryByDeviceName(deviceName, pageable);
    }

    public Page<History> getHistoryByDate(LocalDate date, Pageable pageable) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return historyRepository.findByCreatedAtBetween(start, end, pageable);
    }
}
