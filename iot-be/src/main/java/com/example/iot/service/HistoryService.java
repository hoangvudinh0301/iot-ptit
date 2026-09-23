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

    public Page<History> getHistoryByDate(String time, Pageable pageable) {
        time = time.trim().replace(" ", "T");
        LocalDateTime start;
        LocalDateTime end;
        if (time.length() == 4) {
        // yyyy
            Year year = Year.parse(time);
            start = year.atDay(1).atStartOfDay();
            end = year.plusYears(1).atDay(1).atStartOfDay().minusNanos(1);

        } else if (time.length() == 7) {
            // yyyy-MM
            YearMonth month = YearMonth.parse(time);
            start = month.atDay(1).atStartOfDay();
            end = month.plusMonths(1).atDay(1).atStartOfDay().minusNanos(1);

        } else if (time.length() == 10) {
            // yyyy-MM-dd
            LocalDate date = LocalDate.parse(time);
            start = date.atStartOfDay();
            end = date.plusDays(1).atStartOfDay().minusNanos(1);

        } else if (time.length() == 13) {
            // yyyy-MM-ddTHH
            LocalDateTime dateTime = LocalDateTime.parse(time + ":00:00");
            start = dateTime.withMinute(0).withSecond(0).withNano(0);
            end = start.plusHours(1).minusNanos(1);

        } else if (time.length() == 16) {
            // yyyy-MM-ddTHH:mm
            LocalDateTime dateTime = LocalDateTime.parse(time + ":00");
            start = dateTime.withSecond(0).withNano(0);
            end = start.plusMinutes(1).minusNanos(1);

        } else if (time.length() == 19) {
            // yyyy-MM-ddTHH:mm:ss
            LocalDateTime dateTime = LocalDateTime.parse(time);
            start = dateTime.withNano(0);
            end = start.plusSeconds(1).minusNanos(1);

        } else {
            throw new IllegalArgumentException("Định dạng thời gian không hợp lệ");
        }

        return historyRepository.findByCreatedAtBetween(start, end, pageable);
    }

    public Optional<History> getLatestHistory(Integer deviceId) {
        return historyRepository.findFirstByDevice_IdOrderByCreatedAtDesc(deviceId);
    }
}
