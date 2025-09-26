import React, { useState, useEffect } from "react";
import { MapPin, Activity } from "lucide-react";
import axios from "axios";

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
  width?: number;
  height?: number;
  showGrid?: boolean;
  showCoordinates?: boolean;
  className?: string;
}

const IoTLocationDisplay: React.FC<LocationDisplayProps> = ({
  device,
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
      y: padding + ((100 - y) / 100) * usableHeight, // Invert Y axis so 0,0 is bottom-left
    };
  };

  const devicePixelPos = getPixelPosition(device.location.x, device.location.y);

  // Generate grid lines
  const gridLines = [];
  const padding = 40;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  if (showGrid) {
    // Vertical lines
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

    // Horizontal lines
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

  // Generate axis labels
  const axisLabels = [];
  if (showCoordinates) {
    // X-axis labels
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

    // Y-axis labels
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
        {/* 2D Grid Display */}
        <div className="relative overflow-hidden w-fit mx-auto">
          <svg width={width} height={height} className="block">
            {/* Background */}
            <rect width={width} height={height} fill="white" />

            {/* Grid lines */}
            {gridLines}

            {/* Axis labels */}
            {axisLabels}

            {/* Device position marker */}
            <g>
              {/* Main device marker */}
              <circle
                cx={devicePixelPos.x}
                cy={devicePixelPos.y}
                r="8"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="3"
                className="transition-all duration-300 drop-shadow-lg"
              />

              {/* Device icon */}
              <circle
                cx={devicePixelPos.x}
                cy={devicePixelPos.y}
                r="4"
                fill="white"
              />
            </g>

            {/* Axis labels */}
            <text
              x={width / 2}
              y={height - 5}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-700"
            >
              X
            </text>
            <text
              x={15}
              y={height / 2}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-700"
              transform={`rotate(-90, 15, ${height / 2})`}
            >
              Y
            </text>
          </svg>

          {/* Coordinate tooltip */}
          <div
            className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: devicePixelPos.x,
              top: devicePixelPos.y - 10,
            }}
          >
            ({device.location.x.toFixed(1)}, {device.location.y.toFixed(1)})
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component with simulated real-time updates
const IoTLocationDemo: React.FC = () => {
  const [device, setDevice] = useState<IoTDevice>({
    id: "IOT-001",
    name: "Indoor Sensor",
    location: { x: 45, y: 60, timestamp: new Date() },
    isOnline: true,
  });

  const handleClick = async () => {
    const res = await axios.get("http://148.230.101.206:8000/signal/toggle");
    console.log(res);
  };

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevice((prev) => ({
        ...prev,
        location: {
          x: Math.max(
            0,
            Math.min(100, prev.location.x + (Math.random() - 0.5) * 5)
          ),
          y: Math.max(
            0,
            Math.min(100, prev.location.y + (Math.random() - 0.5) * 5)
          ),
          timestamp: new Date(),
        },
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IoT Device Location Tracker
        </h1>
        <p className="text-gray-600">Real-time indoor positioning system</p>
      </div>

      <IoTLocationDisplay
        device={device}
        width={600}
        height={450}
        showGrid={true}
        showCoordinates={true}
      />

      <button className="" onClick={handleClick}>
        click me
      </button>
    </div>
  );
};

export default IoTLocationDemo;
