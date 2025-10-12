import { useEffect, useRef, useState } from "react";

export interface CoordinateMessage {
  type: "rssi_start" | "rssi_target" | "rssi_path";
  x: number;
  y: number;
  ultrasonic1: number;
  ultrasonic2: number;
  ultrasonic3: number;
}

export function useWebSocket(url: string) {
  // state buat nyimpan status koneksi websocket
  const [status, setStatus] = useState<"Connected" | "Disconnected">(
    "Disconnected"
  );

  // state buat nyimpen koordinat awal
  const [startCoords, setStartCoords] = useState<{
    x: number;
    y: number;
    ultrasonic1: number;
    ultrasonic2: number;
    ultrasonic3: number;
  } | null>(null);

  // state buat nyimpen koordinat target
  const [targetCoords, setTargetCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // state buat nyimpen jejak pergerakan device
  const [pathCoords, setPathCoords] = useState<Array<{ x: number; y: number }>>(
    []
  );

  // state buat posisi sekarang dan data ultrasonic
  const [currentPos, setCurrentPos] = useState<{
    x: number;
    y: number;
    ultrasonic1: number;
    ultrasonic2: number;
    ultrasonic3: number;
  } | null>(null);

  // ref buat simpen object websocket supaya ga reinit tiap render
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // bikin koneksi websocket ke server
    const ws = new WebSocket(url);
    wsRef.current = ws;

    // update status pas koneksi berhasil
    ws.onopen = () => setStatus("Connected");

    // update status pas koneksi putus
    ws.onclose = () => setStatus("Disconnected");

    // handle data yang masuk dari websocket
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as CoordinateMessage;

        // kalau tipe pesan start, simpen koordinat awal & update posisi sekarang
        if (msg.type === "rssi_start") {
          setStartCoords({
            x: msg.x,
            y: msg.y,
            ultrasonic1: msg.ultrasonic1,
            ultrasonic2: msg.ultrasonic2,
            ultrasonic3: msg.ultrasonic3,
          });
          setPathCoords((prev) => {
            const newTrail = [...prev, { x: msg.x, y: msg.y }];
            setCurrentPos({
              x: msg.x,
              y: msg.y,
              ultrasonic1: msg.ultrasonic1,
              ultrasonic2: msg.ultrasonic2,
              ultrasonic3: msg.ultrasonic3,
            });
            return newTrail;
          });

          // kalau tipe pesan target, simpen koordinat target
        } else if (msg.type === "rssi_target") {
          setTargetCoords({ x: msg.x, y: msg.y });

          // kalau tipe pesan path, tambah jejak pergerakan & update posisi sekarang
        } else if (msg.type === "rssi_path") {
          setPathCoords((prev) => {
            const newTrail = [...prev, { x: msg.x, y: msg.y }];
            setCurrentPos({
              x: msg.x,
              y: msg.y,
              ultrasonic1: msg.ultrasonic1,
              ultrasonic2: msg.ultrasonic2,
              ultrasonic3: msg.ultrasonic3,
            });
            return newTrail;
          });
        }
      } catch (e) {
        // handle error parsing kalau data dari ws ga valid
        console.error("Failed to parse WS message:", e);
      }
    };

    // tutup koneksi ws pas komponen unmount
    return () => {
      ws.close();
    };
  }, [url]);

  // return semua data yang dibutuhkan komponen pemanggil
  return { status, startCoords, targetCoords, currentPos, pathCoords };
}
