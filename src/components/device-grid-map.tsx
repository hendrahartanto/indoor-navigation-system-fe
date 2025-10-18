import { useEffect, useRef, useState } from "react";
import type { IoTDevice } from "../pages/dashboard-page";
import { setTargetPoint } from "../api/coordinate-service.ts";

interface DeviceGridMapProps {
  width: number;
  height: number;
  startCoords: {
    x: number;
    y: number;
    ultrasonic1: number;
    ultrasonic2: number;
    ultrasonic3: number;
  } | null;
  targetCoords: { x: number; y: number } | null;
  pathCoords: { x: number; y: number }[];
  device: IoTDevice;
  setDevice: React.Dispatch<React.SetStateAction<IoTDevice>>;
}

export const DeviceGridMap = ({
  width,
  height,
  startCoords,
  targetCoords,
  pathCoords,
  device,
  setDevice,
}: DeviceGridMapProps) => {
  const GRID_SIZE = 3;

  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (pathCoords.length > 0) {
      const lastIndex = pathCoords.length - 1;
      animateTo(pathCoords[lastIndex].x, pathCoords[lastIndex].y, 700);
    }
  }, [pathCoords]);

  const currentPos = useRef({ x: device.location.x, y: device.location.y });
  const animationRef = useRef<number | null>(null);

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

      if (t < 1) animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  };

  const getPixelPosition = (x: number, y: number) => {
    const padding = 40;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    return {
      x: padding + (x / GRID_SIZE) * usableWidth,
      y: padding + ((GRID_SIZE - y) / GRID_SIZE) * usableHeight,
    };
  };

  const getGridCoordFromPixel = (px: number, py: number) => {
    const padding = 40;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    const x = Math.min(
      GRID_SIZE,
      Math.max(0, ((px - padding) / usableWidth) * GRID_SIZE)
    );
    const y = Math.min(
      GRID_SIZE,
      Math.max(0, GRID_SIZE - ((py - padding) / usableHeight) * GRID_SIZE)
    );

    return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const coord = getGridCoordFromPixel(px, py);
    setHoverCoord(coord);
    setHoverPixel({ x: px, y: py });
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
    setHoverPixel(null);
  };

  const handleClick = async () => {
    if (hoverCoord) {
      try {
        const res = await setTargetPoint(hoverCoord);
        console.log(res);
      } catch (error) {}
      alert(`clicked coord: x: ${hoverCoord.x} y: ${hoverCoord.y}`);
    }
  };

  const devicePixelPos = getPixelPosition(device.location.x, device.location.y);
  const startPixelPos = startCoords
    ? getPixelPosition(startCoords.x, startCoords.y)
    : null;
  const targetPixelPos = targetCoords
    ? getPixelPosition(targetCoords.x, targetCoords.y)
    : null;

  const pathPixels = pathCoords.map((p) => getPixelPosition(p.x, p.y));
  const pathPoints = pathPixels.map((p) => `${p.x},${p.y}`).join(" ");

  const padding = 40;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const gridLines = [];

  for (let i = 0; i <= GRID_SIZE; i++) {
    const x = padding + (i / GRID_SIZE) * usableWidth;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={padding}
        x2={x}
        y2={height - padding}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray={i % GRID_SIZE === 0 ? "none" : "2,2"}
      />
    );
  }

  for (let j = 0; j <= GRID_SIZE; j++) {
    const y = padding + (j / GRID_SIZE) * usableHeight;
    gridLines.push(
      <line
        key={`h-${j}`}
        x1={padding}
        y1={y}
        x2={width - padding}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray={j % GRID_SIZE === 0 ? "none" : "2,2"}
      />
    );
  }

  const axisLabels = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
    const x = padding + (i / GRID_SIZE) * usableWidth;
    axisLabels.push(
      <text
        key={`x-label-${i}`}
        x={x}
        y={height - 15}
        textAnchor="middle"
        className="text-xs fill-gray-600"
      >
        {i}
      </text>
    );
  }

  for (let i = 0; i <= GRID_SIZE; i++) {
    const y = padding + (i / GRID_SIZE) * usableHeight;
    axisLabels.push(
      <text
        key={`y-label-${i}`}
        x={25}
        y={y + 4}
        textAnchor="middle"
        className="text-xs fill-gray-600"
      >
        {GRID_SIZE - i}
      </text>
    );
  }

  return (
    <div className="flex-1 border border-gray-200">
      <div className="relative overflow-hidden w-fit mx-auto">
        <svg
          width={width}
          height={height}
          className="block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <rect width={width} height={height} fill="white" />
          {gridLines}
          {axisLabels}

          {pathPixels.length > 1 && (
            <polyline
              points={pathPoints}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.2))" }}
            />
          )}

          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(191, 219, 254)" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" />
            </linearGradient>
          </defs>

          {startPixelPos && (
            <g>
              <circle
                cx={startPixelPos.x}
                cy={startPixelPos.y}
                r="7"
                fill="rgb(34,197,94)"
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

          {targetPixelPos && (
            <g>
              <circle
                cx={targetPixelPos.x}
                cy={targetPixelPos.y}
                r="7"
                fill="rgb(239,68,68)"
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

        {/* tooltip posisi device */}
        <div
          className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: devicePixelPos.x, top: devicePixelPos.y - 10 }}
        >
          ({device.location.x.toFixed(1)}, {device.location.y.toFixed(1)})
        </div>

        {/* tooltip hover koordinat */}
        {hoverCoord && hoverPixel && (
          <div
            className="absolute bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: hoverPixel.x, top: hoverPixel.y - 10 }}
          >
            ({hoverCoord.x}, {hoverCoord.y})
          </div>
        )}
      </div>
    </div>
  );
};
