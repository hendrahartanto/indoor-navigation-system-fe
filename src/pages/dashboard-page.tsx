import { useState } from "react";
import { useWebSocket } from "../hooks/use-web-socket";
import { DeviceGridMap } from "../components/device-grid-map";
import { DeviceInformation } from "../components/device-information";
import {startNavigation} from "../api/publish-navigation.ts";
import { SidebarContentLayout } from "../components/layouts/sidebar-content-layout";

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
    <SidebarContentLayout
      title="Dashboard"
      subtitle="Real-time IoT device location tracking and control"
    >
      <div className="flex gap-8">
        {/* left Section - device info */}
        <div className="flex-1 space-y-6">
          <DeviceInformation device={device} currentCoords={currentCoords} />

          {/* kontrol arah pakai wasd */}
          {/*<WasdController*/}
          {/*  onCommand={(key, type) => {*/}
          {/*    // kirim command gerak ke api mqtt*/}
          {/*    publishDriveCommand(key, type);*/}
          {/*  }}*/}
          {/*/>*/}

        <div className="flex items-center justify-center space-x-2 mt-8">
            <button className="bg-green-500 hover:bg-green-800 hover:cursor-pointer text-white justify-center font-bold py-2 px-4 rounded" onClick={startNavigation}>
                Start Navigation
            </button>
        </div>
        </div>

        {/* right Section - grid map */}
        <div className="flex-shrink-0">
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
    </SidebarContentLayout>
  );
};

export default DashboardPage;
