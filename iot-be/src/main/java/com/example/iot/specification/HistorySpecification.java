package com.example.iot.specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;

import org.springframework.data.jpa.domain.Specification;

import com.example.iot.entity.History;

import jakarta.persistence.criteria.JoinType;

public class HistorySpecification {
    public record TimeRange(LocalDateTime start, LocalDateTime end) {}

    public static TimeRange parseTimeRange(String time) {
        if (time == null || time.isBlank()) {
            throw new IllegalArgumentException("Thời gian không được để trống");
        }

        LocalDateTime start;
        LocalDateTime end;

        if (time.length() == 4) {
            // yyyy
            Year year = Year.parse(time);
            start = year.atDay(1).atStartOfDay();
            end = start.plusYears(1);

        } else if (time.length() == 7) {
            // yyyy-MM
            YearMonth month = YearMonth.parse(time);
            start = month.atDay(1).atStartOfDay();
            end = start.plusMonths(1);

        } else if (time.length() == 10) {
            // yyyy-MM-dd
            LocalDate date = LocalDate.parse(time);
            start = date.atStartOfDay();
            end = start.plusDays(1);

        } else if (time.length() == 13) {
            // yyyy-MM-ddTHH
            start = LocalDateTime.parse(time + ":00:00");
            end = start.plusHours(1);

        } else if (time.length() == 16) {
            // yyyy-MM-ddTHH:mm
            start = LocalDateTime.parse(time + ":00");
            end = start.plusMinutes(1);

        } else if (time.length() == 19) {
            // yyyy-MM-ddTHH:mm:ss
            start = LocalDateTime.parse(time);
            end = start.plusSeconds(1);

        } else {
            throw new IllegalArgumentException(
                "Định dạng thời gian không hợp lệ"
            );
        }

        return new TimeRange(start, end);
    }
    public static Specification<History> filter(
        String time,
        String deviceName,
        String action,
        String status
    ) {
        return (root, query, cb) -> {
            var predicate = cb.conjunction();
            if (time != null && !time.isBlank()) {
                TimeRange range = parseTimeRange(time.trim());
                predicate = cb.and(
                predicate,
                    cb.greaterThanOrEqualTo(
                        root.<LocalDateTime>get("createdAt"),
                        range.start()
                    ),
                    cb.lessThan(
                        root.<LocalDateTime>get("createdAt"),
                        range.end()
                    )
                );
            }
            if (deviceName != null && !deviceName.isBlank()) {
                predicate = cb.and(
                    predicate,
                    cb.equal(cb.lower(root.join("device", JoinType.INNER)
                                            .get("name")),
                                deviceName.toLowerCase().trim()
                            )
                );
            }
            if (action != null && !action.isBlank()) {
                predicate = cb.and(
                    predicate,
                    cb.equal(cb.lower(root.get("action")),
                                action.toLowerCase().trim()
                            )
                );
            }
            if (status != null && !status.isBlank()) {
                predicate = cb.and(
                    predicate,
                    cb.equal(cb.lower(root.get("status")),
                                status.toLowerCase().trim()
                            )
                );
            }
            return predicate;
        };
    }
}
