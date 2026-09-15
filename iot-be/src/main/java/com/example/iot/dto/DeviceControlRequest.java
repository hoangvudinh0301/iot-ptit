package com.example.iot.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter 
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeviceControlRequest {
    Integer deviceId;
    String status;
}
