import { useEffect, useRef, useState } from "react";

interface CoordinateMessage {
  type: "rssi_start" | "rssi_target" | "rssi_path";
  x: number;
  y: number;
}

export function useWebSocket(url: string) {
  const [status, setStatus] = useState<"Connected" | "Disconnected">(
    "Disconnected"
  );
  const [startCoords, setStartCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [targetCoords, setTargetCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pathCoords, setPathCoords] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus("Connected");
    ws.onclose = () => setStatus("Disconnected");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as CoordinateMessage;

        if (msg.type === "rssi_start") {
          setStartCoords({ x: msg.x, y: msg.y });
          setPathCoords((prev) => {
            const newTrail = [...prev, { x: msg.x, y: msg.y }];
            setCurrentPos({ x: msg.x, y: msg.y });
            return newTrail;
          });
        } else if (msg.type === "rssi_target") {
          setTargetCoords({ x: msg.x, y: msg.y });
        } else if (msg.type === "rssi_path") {
          setPathCoords((prev) => {
            const newTrail = [...prev, { x: msg.x, y: msg.y }];
            setCurrentPos({ x: msg.x, y: msg.y });
            return newTrail;
          });
        }
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { status, startCoords, targetCoords, currentPos, pathCoords };
}
