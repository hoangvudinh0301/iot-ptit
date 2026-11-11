    package com.example.iot.service;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.LocalTime;
    import java.time.Year;
    import java.time.YearMonth;
    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.List;

    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.domain.Specification;
    import org.springframework.stereotype.Service;

    import com.example.iot.entity.Sensor;
    import com.example.iot.entity.SensorData;
    import com.example.iot.repository.SensorDataRepository;
    import com.example.iot.repository.SensorRepository;

    import jakarta.persistence.criteria.Predicate;

    import java.util.Optional;
    import lombok.AccessLevel;
    import lombok.RequiredArgsConstructor;
    import lombok.experimental.FieldDefaults;

    @Service 
    @RequiredArgsConstructor 
    @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
    public class SensorDataService {

        SensorDataRepository sensorDataRepository;
        SensorRepository sensorRepository;

        public List<SensorData> getAllSensorDataChart() {
            return sensorDataRepository.findAll();
        }

        public Page<SensorData> getAllSensorData(Pageable pageable) {
            return sensorDataRepository.findAll(pageable);
        }

        public Page<SensorData> getSensorDataByDate(String time, Pageable pageable) {
            time = time.trim().replace(" ", "T");

            if (time.matches("\\d{2}:\\d{2}:\\d{2}")) {
                LocalTime localTime = LocalTime.parse(time);

                return sensorDataRepository.findByTime(
                    localTime,
                    pageable
                );
            }
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

            return sensorDataRepository.findByCreatedAtBetween(start, end, pageable);
        }
        public void saveSensorData(String type, Double value) {
            Sensor sensor = sensorRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Sensor not found: " + type));
            SensorData sensorData = new SensorData();
            sensorData.setSensor(sensor);
            sensorData.setValue(value);
            sensorData.setCreatedAt(LocalDateTime.now());
            sensorDataRepository.save(sensorData);
        }
        public Optional<SensorData> getLatestByType(String type) {
            return sensorDataRepository.findLatesBySensorType(type).stream().findFirst();
        }

        public Page<SensorData> getSensorDataBySensorValue(String type, Double value, Pageable pageable) {
            return sensorDataRepository.searchSensorDataBySensorValue(type, value, pageable);
        }
        
        public List<SensorData> getLatest30() {
            List<SensorData> data =
                sensorDataRepository.findTop30ByOrderByCreatedAtDesc();
            
            Collections.reverse(data);

            return data;
        }
        
        public Page<SensorData> searchAll(String keyword, Pageable pageable) {
            String search = keyword == null ? "" : keyword.trim();

            if (search.isEmpty()) {
                return sensorDataRepository.findAll(pageable);
            }

            Specification<SensorData> spec = (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();

                // 1. Tìm theo tên cảm biến
                predicates.add(
                    cb.like(
                        cb.lower(root.join("sensor").get("name")),
                        "%" + search.toLowerCase() + "%"
                    )
                );

                // 2. Tìm theo giá trị số
                try {
                    Double value = Double.parseDouble(search);

                    predicates.add(
                        cb.equal(root.get("value"), value)
                    );
                } catch (NumberFormatException ignored) {
                }

                // 3. Tìm theo thời gian
                try {
                    String time = search.replace(" ", "T");

                    LocalDateTime start = null;
                    LocalDateTime end = null;

                    if (time.matches("\\d{4}")) {
                        Year year = Year.parse(time);
                        start = year.atDay(1).atStartOfDay();
                        end = start.plusYears(1);

                    } else if (time.matches("\\d{4}-\\d{2}")) {
                        YearMonth month = YearMonth.parse(time);
                        start = month.atDay(1).atStartOfDay();
                        end = start.plusMonths(1);

                 } else if (time.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    LocalDate date = LocalDate.parse(time);

                    start = date.atStartOfDay();
                    end = start.plusDays(1);

                } else if (time.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}")) {
                    start = LocalDateTime.parse(time + ":00:00");
                    end = start.plusHours(1);

                } else if (time.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}")) {
                    start = LocalDateTime.parse(time + ":00");
                    end = start.plusMinutes(1);

                } else if (time.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}")) {
                    start = LocalDateTime.parse(time);
                    end = start.plusSeconds(1);
                }

                    if (start != null && end != null) {
                        predicates.add(
                            cb.and(
                                cb.greaterThanOrEqualTo(
                                    root.get("createdAt"), start
                                ),
                                cb.lessThan(
                                    root.get("createdAt"), end
                                )
                            )
                        );
                    }

                    // Tìm theo HH:mm:ss
                    if (time.matches("\\d{2}:\\d{2}:\\d{2}")) {
                        LocalTime localTime = LocalTime.parse(time);

                        // MySQL: TIME(created_at)
                        predicates.add(
                            cb.equal(
                                cb.function(
                                    "TIME",
                                    LocalTime.class,
                                    root.get("createdAt")
                                ),
                                localTime
                            )
                        );
                    }

                } catch (Exception ignored) {
                    // Không phải thời gian hợp lệ, vẫn tìm theo tên/giá trị
                }

                return cb.or(predicates.toArray(new Predicate[0]));
            };

            return sensorDataRepository.findAll(spec, pageable);
        }

    }
