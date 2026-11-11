
package com.example.iot.controller;

import com.example.iot.entity.BlinkEvent;
import com.example.iot.repository.BlinkEventRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/statistics")
public class BlinkStatisticsController {

    private final BlinkEventRepository repository;

    public BlinkStatisticsController(
            BlinkEventRepository repository
    ) {
        this.repository = repository;
    }

    @GetMapping("/blinks")
    public Map<String, Object> getBlinkStatistics() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);
        LocalDateTime startOfToday = today.atStartOfDay();

        List<BlinkEvent> recentWeek =
                repository
                    .findAllByOccurredAtGreaterThanEqualOrderByOccurredAtDesc(
                        startDate.atStartOfDay()
                    );

        Map<LocalDate, long[]> dailyCounts = new TreeMap<>();

        for (int i = 0; i < 7; i++) {
            dailyCounts.put(
                    startDate.plusDays(i),
                    new long[3]
            );
        }

        for (BlinkEvent event : recentWeek) {
            int index = event.getDeviceId() - 1;

            if (index < 0 || index > 2) {
                continue;
            }

            LocalDate date =
                    event.getOccurredAt().toLocalDate();

            long[] counts = dailyCounts.get(date);

            if (counts != null) {
                counts[index]++;
            }
        }

        List<Map<String, Object>> daily = new ArrayList<>();
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM");

        for (Map.Entry<LocalDate, long[]> entry
                : dailyCounts.entrySet()) {

            long[] counts = entry.getValue();
            Map<String, Object> row = new LinkedHashMap<>();

            row.put(
                    "date",
                    entry.getKey().format(formatter)
            );
            row.put("led1", counts[0]);
            row.put("led2", counts[1]);
            row.put("led3", counts[2]);

            daily.add(row);
        }

        String[] names = {
                "Đèn 1",
                "Đèn 2",
                "Đèn 3"
        };

        String[] sensors = {
                "Nhiệt độ",
                "Độ ẩm",
                "Ánh sáng"
        };

        List<Map<String, Object>> devices = new ArrayList<>();
        long total = 0;

        for (int id = 1; id <= 3; id++) {
            long allTime = repository.countByDeviceId(id);

            long todayCount =
                    repository
                        .countByDeviceIdAndOccurredAtGreaterThanEqual(
                                id,
                                startOfToday
                        );

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put("deviceId", id);
            item.put("name", names[id - 1]);
            item.put("sensor", sensors[id - 1]);
            item.put("total", allTime);
            item.put("today", todayCount);

            devices.add(item);
            total += allTime;
        }

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("total", total);
        response.put("devices", devices);
        response.put("daily", daily);
        response.put(
                "recent",
                repository.findTop20ByOrderByOccurredAtDesc()
        );

        return response;
    }
}
