package com.example.iot.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.iot.entity.Device;
import com.example.iot.repository.DeviceRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service 
@RequiredArgsConstructor 
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceService {

    DeviceRepository deviceRepository;

    public Device getDeviceById(Integer deviceId) {
        return deviceRepository.getById(deviceId);
    }
}
