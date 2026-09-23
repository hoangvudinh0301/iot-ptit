import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

function DeviceItem({ deviceId, name }) {
    const [isOn, setIsOn] = useState(false);
    const [pending, setPending] = useState(false);

    // Lấy trạng thái hiện tại
    useEffect(() => {
        fetch(`http://localhost:8080/api/device?deviceId=${deviceId}`)
            .then(res => res.json())
            .then(data => setIsOn(data.status === "ON"))
            .catch(err => console.error("Cannot get device status:", err));
    }, [deviceId]);

    // Gửi lệnh bật / tắt
    const toggleDevice = async () => {
        if (pending) return;

        const newStatus = isOn ? "OFF" : "ON";
        setPending(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/device/control",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: 1,
                        deviceId,
                        action: newStatus
                    })
                }
            );

            if (!response.ok) throw new Error("Control fail");

            console.log("Command:", await response.json());
        } catch (error) {
            console.error(error);
            setPending(false);
        }
    };

    // Chờ trạng thái từ backend
    useEffect(() => {
        if (!pending) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/history/latest?deviceId=${deviceId}`
                );

                if (!response.ok) return;

                const history = await response.json();

                if (history.status === "ON" || history.status === "OFF") {
                    setIsOn(history.status === "ON");
                    setPending(false);
                }
            } catch (error) {
                console.error(error);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [pending, deviceId]);

    return (
        <div className="device-item">

            <FontAwesomeIcon
                icon={faLightbulb}
                className={`device-icon ${isOn ? "on" : "off"}`}
            />

            <span className="device-name">{name}</span>

            <button
                className={`switch ${isOn ? "on" : ""}`}
                onClick={toggleDevice}
                disabled={pending}
            >
                <span className="switch-circle"></span>
            </button>

            {pending && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <span>Đang xử lý...</span>
                </div>
            )}

        </div>
    );
}
export default DeviceItem;
