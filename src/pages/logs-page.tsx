import { useEffect, useState } from "react";
import type { Log, LogType } from "../types/model";
import { SidebarContentLayout } from "../components/layouts/sidebar-content-layout";

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fakeLogs: Log[] = [
      {
        timestamp: new Date("2025-10-17T08:30:00"),
        logType: "MCU",
        text: "Device A successfully connected.",
      },
      {
        timestamp: new Date("2025-10-17T08:35:00"),
        logType: "ACTIVITY",
        text: "User admin accessed Monitoring page.",
      },
      {
        timestamp: new Date("2025-10-17T09:00:00"),
        logType: "MCU",
        text: "Device B signal lost.",
      },
    ];
    setLogs(fakeLogs);
  }, []);

  const getLogTypeColor = (type: LogType) => {
    switch (type) {
      case "MCU":
        return "text-blue-600 bg-blue-50";
      case "ACTIVITY":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <SidebarContentLayout title="Logs" subtitle="View all logs">
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200">Timestamp</th>
              <th className="px-4 py-3 border-b border-gray-200">Type</th>
              <th className="px-4 py-3 border-b border-gray-200">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors text-sm"
              >
                <td className="px-4 py-3 border-b border-gray-200 font-mono text-gray-600">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(
                      log.logType
                    )}`}
                  >
                    {log.logType}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-800">
                  {log.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No logs available.
          </div>
        )}
      </div>
    </SidebarContentLayout>
  );
};

export default Logs;
