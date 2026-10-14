import { Client } from "@stomp/stompjs";

export const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",

    reconnectDelay: 5000,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
        console.log("WebSocket connected");
    },

    onStompError: (frame) => {
        console.error("STOMP error:", frame);
    },

    onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
    }
});