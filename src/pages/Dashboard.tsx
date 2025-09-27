import React, { useState, useEffect, useRef } from "react";
import { MapPin, Activity } from "lucide-react";
import { useWebSocket } from "../hooks/use-web-socket";

interface DeviceLocation {
  x: number;
  y: number;
  timestamp?: Date;
}

interface IoTDevice {
  id: string;
  name: string;
  location: DeviceLocation;
  isOnline?: boolean;
}

interface LocationDisplayProps {
  device: IoTDevice;
  start?: { x: number; y: number } | null;
  target?: { x: number; y: number } | null;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showCoordinates?: boolean;
  className?: string;
}

const IoTLocationDisplay: React.FC<LocationDisplayProps> = ({
  device,
  start,
  target,
  width = 500,
  height = 400,
  showGrid = true,
  showCoordinates = true,
  className = "",
}) => {
  // Convert coordinate system (0-100) to pixel positions
  const getPixelPosition = (x: number, y: number) => {
    const padding = 40;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    return {
      x: padding + (x / 100) * usableWidth,
      y: padding + ((100 - y) / 100) * usableHeight,
    };
  };

  const devicePixelPos = getPixelPosition(device.location.x, device.location.y);
  const startPixelPos = start ? getPixelPosition(start.x, start.y) : null;
  const targetPixelPos = target ? getPixelPosition(target.x, target.y) : null;

  const gridLines = [];
  const padding = 40;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  if (showGrid) {
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * usableWidth;
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray={i % 5 === 0 ? "none" : "2,2"}
        />
      );
    }

    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * usableHeight;
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray={i % 5 === 0 ? "none" : "2,2"}
        />
      );
    }
  }

  const axisLabels = [];
  if (showCoordinates) {
    for (let i = 0; i <= 10; i += 2) {
      const x = padding + (i / 10) * usableWidth;
      axisLabels.push(
        <text
          key={`x-label-${i}`}
          x={x}
          y={height - 15}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {i * 10}
        </text>
      );
    }

    for (let i = 0; i <= 10; i += 2) {
      const y = padding + (i / 10) * usableHeight;
      axisLabels.push(
        <text
          key={`y-label-${i}`}
          x={25}
          y={y + 4}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {(10 - i) * 10}
        </text>
      );
    }
  }

  return (
    <div
      className={`flex gap-10 bg-white rounded-lg border border-gray-300 shadow-sm p-7 ${className}`}
    >
      <div className="left flex-1">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {device.name}
            </h3>
            <span className="text-sm text-gray-500">ID: {device.id}</span>
          </div>
          <div className="flex items-center space-x-3">
            {device.isOnline !== undefined && (
              <div className="flex items-center space-x-1">
                <Activity
                  className={`h-4 w-4 ${
                    device.isOnline ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    device.isOnline ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {device.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Coordinate Display */}
        <div className="mb-4 flex items-center justify-between bg-gray-50 rounded p-3">
          <div className="flex space-x-6">
            <div>
              <span className="text-sm font-medium text-gray-700">X:</span>
              <span className="ml-2 text-lg font-mono font-bold text-blue-600">
                {device.location.x.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Y:</span>
              <span className="ml-2 text-lg font-mono font-bold text-blue-600">
                {device.location.y.toFixed(1)}
              </span>
            </div>
          </div>
          {device.location.timestamp && (
            <div className="text-sm text-gray-500">
              Last update: {device.location.timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="right flex-1 border border-gray-200">
        <div className="relative overflow-hidden w-fit mx-auto">
          <svg width={width} height={height} className="block">
            <rect width={width} height={height} fill="white" />
            {gridLines}
            {axisLabels}

            {/* START marker */}
            {startPixelPos && (
              <g>
                <circle
                  cx={startPixelPos.x}
                  cy={startPixelPos.y}
                  r="7"
                  fill="rgb(34,197,94)" // green-500
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={startPixelPos.x}
                  y={startPixelPos.y - 12}
                  textAnchor="middle"
                  className="text-xs fill-green-600"
                >
                  Start
                </text>
              </g>
            )}

            {/* TARGET marker */}
            {targetPixelPos && (
              <g>
                <circle
                  cx={targetPixelPos.x}
                  cy={targetPixelPos.y}
                  r="7"
                  fill="rgb(239,68,68)" // red-500
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={targetPixelPos.x}
                  y={targetPixelPos.y - 12}
                  textAnchor="middle"
                  className="text-xs fill-red-600"
                >
                  Target
                </text>
              </g>
            )}

            {/* CURRENT device marker */}
            <g>
              <circle
                cx={devicePixelPos.x}
                cy={devicePixelPos.y}
                r="8"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="3"
              />
              <circle
                cx={devicePixelPos.x}
                cy={devicePixelPos.y}
                r="4"
                fill="white"
              />
            </g>
          </svg>

          {/* Curr Coordinate Tooltip */}
          <div
            className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: devicePixelPos.x, top: devicePixelPos.y - 10 }}
          >
            {" "}
            ({device.location.x.toFixed(1)}, {device.location.y.toFixed(1)}){" "}
          </div>
        </div>
      </div>
    </div>
  );
};

const IoTLocationDemo: React.FC = () => {
  const { startCoords, targetCoords } = useWebSocket("ws://localhost:8000/ws");

  const [device, setDevice] = useState({
    id: "IOT-001",
    name: "Indoor Sensor",
    location: { x: 45, y: 60, timestamp: new Date() },
    isOnline: true,
  });

  const currentPos = useRef({ x: device.location.x, y: device.location.y });
  const animationRef = useRef<number>(null);

  const animateTo = (targetX: number, targetY: number, duration = 500) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const startX = currentPos.current.x;
    const startY = currentPos.current.y;
    const startTime = performance.now();

    const step = (time: number) => {
      const t = Math.min((time - startTime) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const newX = startX + (targetX - startX) * eased;
      const newY = startY + (targetY - startY) * eased;
      currentPos.current = { x: newX, y: newY };

      setDevice((prev) => ({
        ...prev,
        location: { x: newX, y: newY, timestamp: new Date() },
      }));

      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  // animasi bergerak mengikuti target jika targetCoords berubah
  useEffect(() => {
    if (targetCoords) {
      animateTo(targetCoords.x, targetCoords.y, 700);
    }
  }, [targetCoords]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IoT Device Location Tracker
        </h1>
        <p className="text-gray-600">Real-time indoor positioning system</p>
      </div>

      <IoTLocationDisplay
        device={device}
        start={startCoords}
        target={targetCoords}
        width={600}
        height={450}
        showGrid
        showCoordinates
      />
    </div>
  );
};

export default IoTLocationDemo;
