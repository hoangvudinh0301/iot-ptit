package com.example.iot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.iot.entity.History;
import com.example.iot.repository.HistoryRepository;
import com.example.iot.specification.HistorySpecification;

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
    
    public Optional<History> getLatestHistory(Integer deviceId) {
        return historyRepository.findFirstByDevice_IdOrderByCreatedAtDesc(deviceId);
    }
    public Page<History> searchHistory(
        String time,
        String deviceName,
        String action,
        String status,
        Pageable pageable
    ) {
        return historyRepository.findAll(HistorySpecification.filter(time, deviceName, action, status), pageable);
    }
}
