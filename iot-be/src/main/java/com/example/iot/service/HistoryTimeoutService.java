
package com.example.iot.service;

import com.example.iot.entity.History;
import com.example.iot.repository.HistoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryTimeoutService {

    private final HistoryRepository historyRepository;

    @Scheduled(fixedDelay = 500)
    @Transactional
    public void checkTimeout() {

        LocalDateTime deadline =
            LocalDateTime.now().minusSeconds(3);

        List<History> pendingHistories =
            historyRepository.findByStatusAndCreatedAtBefore(
                "PENDING",
                deadline
            );

        for (History history : pendingHistories) {
            history.setStatus("FAILED");

            System.out.println(
                "FAILED: Device "
                + history.getDevice().getId()
                + " - Action: "
                + history.getAction()
            );
        }
    }
}
