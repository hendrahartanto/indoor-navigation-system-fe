import { useState } from "react";
import { useWebSocket } from "../hooks/use-web-socket";
import WasdController from "../components/wasd-controller";
import { publishDriveCommand } from "../api/publish-drive";
import { DeviceGridMap } from "../components/device-grid-map";
import { DeviceInformation } from "../components/device-information";

export interface DeviceLocation {
  x: number;
  y: number;
  timestamp?: Date;
}

export interface IoTDevice {
  id: string;
  name: string;
  location: DeviceLocation;
  isOnline?: boolean;
}

const DashboardPage = () => {
  const width = 600;
  const height = 500;

  // hook custom untuk ambil data posisi device lewat websocket
  const {
    startCoords,
    targetCoords,
    pathCoords,
    currentPos: currentCoords,
  } = useWebSocket(`wss://${window.location.host}/api/ws`);

  // state utama untuk nyimpen info device iot
  const [device, setDevice] = useState<IoTDevice>({
    id: "IOT-001",
    name: "Indoor Sensor",
    location: { x: 0, y: 0, timestamp: new Date() },
    isOnline: true,
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IoT Device Location Tracker
        </h1>
        <p className="text-gray-600">Real-time indoor positioning system</p>
      </div>

      <div
        className={
          "flex gap-10 bg-white rounded-lg border border-gray-300 shadow-sm p-7"
        }
      >
        <div className="left flex-1">
          {/* bagian kiri buat info device dan kontrol manual */}
          <DeviceInformation device={device} currentCoords={currentCoords} />

          {/* kontrol arah pakai wasd */}
          <WasdController
            onCommand={(key, type) => {
              // kirim command gerak ke api mqtt
              publishDriveCommand(key, type);
            }}
          />
        </div>

        {/* tampilakn grid map */}
        <DeviceGridMap
          device={device}
          height={height}
          width={width}
          pathCoords={pathCoords}
          setDevice={setDevice}
          startCoords={startCoords}
          targetCoords={targetCoords}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
