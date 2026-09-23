import time
import json
import random
import threading
import paho.mqtt.client as mqtt

BROKER = "172.20.10.3"
PORT = 1884
USERNAME = "admin"
PASSWORD = "123456"

CONTROL_TOPIC = "device/control"
SENSOR_TOPIC = "sensor/data"

LED_STATUS = {
    1: True,
    2: False
}

def publish_status(client, device_id, status):
    topic = f"device/status/{device_id}"
    message = "ON" if status else "OFF"

    client.publish(
        topic,
        message,
        qos=1,
        retain=True
    )

    print(f"Published: {topic} -> {message}")


def publish_all_status(client):
    print("Publishing current device statuses...")

    for device_id, status in LED_STATUS.items():
        publish_status(
            client,
            device_id,
            status
        )

def publish_sensor_data(client):

    while True:

        # Giả lập dữ liệu giống DHT11 + LDR
        temperature = round(
            random.uniform(25.0, 35.0),
            2
        )

        humidity = round(
            random.uniform(45.0, 75.0),
            2
        )

        light = random.randint(
            100,
            1000
        )

        data = {
            "temperature": temperature,
            "humidity": humidity,
            "light": light
        }

        message = json.dumps(data)

        success = client.publish(
            SENSOR_TOPIC,
            message,
            qos=1
        )

        if success.rc == mqtt.MQTT_ERR_SUCCESS:
            print(
                f"Published sensor: {message}"
            )
        else:
            print("Sensor publish failed")

        # Giống ESP32 interval = 2000ms
        time.sleep(3)

def on_connect(client, userdata, flags, rc):

    print("MQTT connected:", rc)

    if rc != 0:
        print("MQTT connection failed")
        return

    client.subscribe(
        CONTROL_TOPIC,
        qos=1
    )

    print(
        "Subscribed:",
        CONTROL_TOPIC
    )

    # Publish trạng thái ban đầu
    publish_all_status(client)


def on_message(client, userdata, msg):

    message = msg.payload.decode().strip()

    print(
        f"\nReceived: "
        f"{msg.topic} -> {message}"
    )

    separator = message.find(":")

    if separator == -1:
        print("Invalid command")
        return

    target = message[:separator].strip().lower()
    state = message[separator + 1:].strip().upper()

    print("Target:", target)
    print("State:", state)

    if state not in ["ON", "OFF"]:
        print("Invalid state")
        return

    print("Processing...")

    # Giả lập ESP32 xử lý
    time.sleep(2)

    new_status = state == "ON"

    if target == "1":

        LED_STATUS[1] = new_status

        publish_status(
            client,
            1,
            new_status
        )

    elif target == "2":

        LED_STATUS[2] = new_status

        publish_status(
            client,
            2,
            new_status
        )

    elif target == "all":

        LED_STATUS[1] = new_status
        LED_STATUS[2] = new_status

        publish_status(
            client,
            1,
            new_status
        )

        publish_status(
            client,
            2,
            new_status
        )

        print(
            f"ALL DEVICES -> {state}"
        )

    else:
        print("Unknown target")

client = mqtt.Client()

client.username_pw_set(
    USERNAME,
    PASSWORD
)

client.on_connect = on_connect
client.on_message = on_message

client.connect(
    BROKER,
    PORT,
    60
)

print("MQTT Simulator started")

sensor_thread = threading.Thread(
    target=publish_sensor_data,
    args=(client,),
    daemon=True
)

sensor_thread.start()
client.loop_forever()
