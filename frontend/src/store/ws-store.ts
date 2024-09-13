import create from "zustand";

interface WebSocketState {
  ws: WebSocket | null;
  messages: string[];
  connect: (userId: string) => void;
  sendMessage: (msg: string) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  ws: null,
  messages: [],

  connect: (userId: string) => {
    const ws = new WebSocket(`/ws?type=admin&userId=${userId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "welcome") {
          console.log("Server message:", data.message);
        }
        set((state) => ({ messages: [...state.messages, data.message] }));
      } catch (err) {
        console.log(err);
        console.error("Invalid message format:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    set({ ws });
  },

  sendMessage: (msg) => {
    set((state) => {
      if (state.ws) {
        state.ws.send(JSON.stringify({ type: "client-message", message: msg }));
      }
      return state;
    });
  },
}));
