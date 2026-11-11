
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLightbulb,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { Client } from "@stomp/stompjs";
import { apiFetch } from "../../services/api";
import "./DeviceItem.css";

function DeviceItem({ deviceId, name }) {
    const id = Number(deviceId);
    const isWarningDevice = id === 4;

    const [isOn, setIsOn] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const pendingRef = useRef(false);
    const lastWsUpdateRef = useRef(0);

    // ==========================
    // LED4: REALTIME STATUS
    // ==========================
    useEffect(() => {
        let mounted = true;
        let requestInFlight = false;

        const fetchStatus = async () => {
            if (requestInFlight) return;

            requestInFlight = true;
            const startedAt = Date.now();

            try {
                const data = await apiFetch(
                    `/api/device?deviceId=${id}`
                );

                if (!mounted) return;

                // Không để API cũ ghi đè WebSocket mới
                if (
                    isWarningDevice &&
                    lastWsUpdateRef.current > startedAt
                ) {
                    return;
                }

                const status = String(
                    data?.status ?? ""
                ).trim().toUpperCase();

                if (status === "ON" || status === "OFF") {
                    // LED1-3 đang điều khiển thì không
                    // ghi đè trạng thái trong lúc chờ
                    if (!isWarningDevice && pendingRef.current) {
                        return;
                    }

                    setIsOn(status === "ON");
                }
            } catch (err) {
                console.error(
                    `[Device ${id}] API error:`,
                    err
                );
            } finally {
                requestInFlight = false;
            }
        };

        fetchStatus();

        if (!isWarningDevice) {
            return () => {
                mounted = false;
            };
        }

        // Đồng bộ dự phòng mỗi 2 giây
        const pollingId = setInterval(() => {
            fetchStatus();
        }, 2000);

        const wsUrl = `${
            window.location.protocol === "https:"
                ? "wss:"
                : "ws:"
        }//${window.location.hostname}:8080/ws`;

        const stompClient = new Client({
            brokerURL: wsUrl,

            connectHeaders: {
                Authorization: `Bearer ${
                    sessionStorage.getItem("accessToken") || ""
                }`
            },

            reconnectDelay: 3000,

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                if (!mounted) return;

                console.log("[LED4] WebSocket connected");

                stompClient.subscribe(
                    "/topic/device-status",
                    message => {
                        if (!mounted) return;

                        try {
                            const data = JSON.parse(
                                message.body
                            );

                            console.log(
                                "[LED4] WebSocket received:",
                                data
                            );

                            if (Number(data.deviceId) !== 4) {
                                return;
                            }

                            const status = String(
                                data.status ?? ""
                            ).trim().toUpperCase();

                            if (
                                status !== "ON" &&
                                status !== "OFF"
                            ) {
                                return;
                            }

                            lastWsUpdateRef.current =
                                Date.now();

                            setIsOn(status === "ON");

                            console.log(
                                `[LED4] ${status}`
                            );

                        } catch (err) {
                            console.error(
                                "[LED4] Invalid WS message:",
                                err
                            );
                        }
                    }
                );

                // Đồng bộ ngay sau khi kết nối
                fetchStatus();
            },

            onWebSocketError: error => {
                console.error(
                    "[LED4] WebSocket error:",
                    error
                );
            },

            onStompError: frame => {
                console.error(
                    "[LED4] STOMP error:",
                    frame
                );
            },

            onWebSocketClose: () => {
                console.warn(
                    "[LED4] WebSocket disconnected"
                );
            }
        });

        stompClient.activate();

        return () => {
            mounted = false;
            clearInterval(pollingId);
            stompClient.deactivate();
        };
    }, [id, isWarningDevice]);

    // ==========================
    // CONTROL LED1 - LED3
    // ==========================
    const toggleDevice = async () => {
        if (isWarningDevice || pendingRef.current) {
            return;
        }

        const newStatus = isOn ? "OFF" : "ON";

        pendingRef.current = true;
        setPending(true);
        setError("");

        try {
            await apiFetch("/api/device/control", {
                method: "POST",
                body: JSON.stringify({
                    userId: 1,
                    deviceId: id,
                    action: newStatus
                })
            });

            const startTime = Date.now();

            while (Date.now() - startTime < 24000) {
                await new Promise(resolve =>
                    setTimeout(resolve, 500)
                );

                const history = await apiFetch(
                    `/api/history/latest?deviceId=${id}`
                );

                if (
                    history?.status === "SUCCESS" &&
                    history?.action === newStatus
                ) {
                    setIsOn(newStatus === "ON");
                    return;
                }

                if (
                    history?.status === "FAILED" &&
                    history?.action === newStatus
                ) {
                    throw new Error(
                        "Điều khiển không thành công"
                    );
                }
            }

            throw new Error(
                "Không nhận được xác nhận từ thiết bị"
            );

        } catch (err) {
            console.error("Control error:", err);

            setError(
                err.message || "Điều khiển thất bại"
            );

            try {
                const data = await apiFetch(
                    `/api/device?deviceId=${id}`
                );

                setIsOn(data?.status === "ON");
            } catch (fetchErr) {
                console.error(fetchErr);
            }

        } finally {
            pendingRef.current = false;
            setPending(false);
        }
    };

    // ==========================
    // DEVICE 4: WARNING UI
    // ==========================
    if (isWarningDevice) {
        return (
            <div className="device-item-wrapper">
                <div
                    className={`device-item warning-device ${
                        isOn ? "warning-active" : ""
                    }`}
                >
                    <div className="warning-device-info">
                        <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className={`warning-device-icon ${
                                isOn ? "warning-blink" : ""
                            }`}
                        />

                        <div className="warning-device-text">
                            <span className="device-name">
                                {name}
                            </span>

                            <small>
                                Cảnh báo ánh sáng
                            </small>
                        </div>
                    </div>

                    <span
                        className={`warning-status ${
                            isOn ? "active" : ""
                        }`}
                    >
                        {isOn
                            ? "CẢNH BÁO"
                            : "Bình thường"}
                    </span>
                </div>
            </div>
        );
    }

    // ==========================
    // DEVICE 1, 2, 3
    // ==========================
    return (
        <div className="device-item-wrapper">
            <div className="device-item">
                <FontAwesomeIcon
                    icon={faLightbulb}
                    className={`device-icon ${
                        isOn ? "on" : "off"
                    }`}
                />

                <span className="device-name">
                    {name}
                </span>

                
            <button
                type="button"
                className={`switch ${isOn ? "on" : ""} ${pending ? "pending" : ""}`}
                onClick={toggleDevice}
                disabled={pending}
                aria-busy={pending}
                aria-label={pending ? "Đang xử lý" : isOn ? "Tắt thiết bị" : "Bật thiết bị"}
            >
                {pending ? (
                    <span className="switch-spinner" />
                ) : (
                    <span className="switch-circle" />
                )}
            </button>

            </div>

            {error && (
                <div className="device-error">
                    {error}
                </div>
            )}
        </div>
    );
}

export default DeviceItem;
