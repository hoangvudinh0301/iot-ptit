import { Client } from "@stomp/stompjs";

const token = sessionStorage.getItem("accessToken");

const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",

    connectHeaders: {
        Authorization: `Bearer ${token}`
    },

    reconnectDelay: 5000,

    onConnect: () => {
        stompClient.subscribe("/topic/sensors", (message) => {
            const data = JSON.parse(message.body);
            console.log("Sensor realtime:", data);
        });
    }
});

stompClient.activate();