import DeviceItem from "./DeviceItem"
import "./DevicePanel.css"

function DevicePanel() {
    return (
        <div className="device-panel">
            <h3>Thiết bị</h3>
            <DeviceItem name="Device 1" />
            <DeviceItem name="Device 2" />
        </div>
    )
}

export default DevicePanel