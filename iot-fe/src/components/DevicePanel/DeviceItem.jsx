import {useState} from "react";

function DeviceItem({ name }) {
    const [isOn, setIsOn] = useState(false);

    // const toggleDevice = () => {
    //     const newStatus = !isOn;

    //     try {
    //         const resopnse = await fetch(
    //             "")
    //     }
    // };

    return (
        <div className="device-item">
            <span>{name}</span>
            <button className={`switch ${isOn ? "on" : ""}`} onClick={toggleDevice}>
                <span className="switch-circle"></span>
            </button>

        </div>
    )
}
export default DeviceItem