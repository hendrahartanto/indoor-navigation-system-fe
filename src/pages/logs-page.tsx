import { useEffect, useState } from "react";
import type { Log, LogType } from "../types/model";
import { SidebarContentLayout } from "../components/layouts/sidebar-content-layout";
import {getLogData} from "../api/log-service.ts";
import Pagination from "../components/logs-pagination.tsx";

const Logs = () => {

  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  console.log(totalPage)

  const fetchLogs = async () => {
    const res = await getLogData("2025-10-17", page)
    setLogs(res.data.data)
    setTotalPage(res.data.total_pages)
  }

  useEffect(() => {
    fetchLogs().then()
  }, [page]);

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

                  {log.timestamp.toLocaleString().split('T')[0]} {log.timestamp.toLocaleString().split('T')[1].substring(0, 5)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(
                      log.status
                    )}`}
                  >
                    {log.status}
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

      <div className='flex justify-center fixed bottom-8 right-0 left-0 m-auto'>
        <Pagination totalPages={totalPage} currentPage={page} onPageChange={setPage}/>
      </div>
    </SidebarContentLayout>
  );
};

export default Logs;
