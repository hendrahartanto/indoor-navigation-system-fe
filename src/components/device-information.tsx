import { Activity, MapPin } from "lucide-react";
import type { IoTDevice } from "../pages/dashboard-page";

interface DeviceInformation {
  device: IoTDevice;
  currentCoords: {
    x: number;
    y: number;
    ultrasonic1: number;
    ultrasonic2: number;
    ultrasonic3: number;
  } | null;
}

export const DeviceInformation = ({
  device,
  currentCoords,
}: DeviceInformation) => {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
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

      {/* info koordinat posisi device */}
      <div>
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

        {/* info sensor ultrasonic */}
        <div className="mb-4 flex items-center justify-between bg-gray-50 rounded p-3">
          <div className="flex space-x-6">
            <div>
              <span className="text-sm font-medium text-gray-700">
                ultrasonic1:
              </span>
              <span className="ml-2 text-lg font-mono font-bold text-blue-600">
                {currentCoords?.ultrasonic1}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                ultrasonic2:
              </span>
              <span className="ml-2 text-lg font-mono font-bold text-blue-600">
                {currentCoords?.ultrasonic2}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                ultrasonic3:
              </span>
              <span className="ml-2 text-lg font-mono font-bold text-blue-600">
                {currentCoords?.ultrasonic3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
