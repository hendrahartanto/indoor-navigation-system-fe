import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from "recharts";
import type { RawRSSI } from "../types/model";
import { SidebarContentLayout } from "../components/layouts/sidebar-content-layout";
import { getMonitoringData } from "../api/monitoring-service.ts";

interface ChartData {
  time: string;
  variance1: number;
  variance2: number;
  variance3: number;
  median1: number;
  median2: number;
  median3: number;
  mean1: number;
  mean2: number;
  mean3: number;
}

const Monitoring = () => {
  // state untuk menyimpan tanggal, data rssi, dan jenis rssi yang dipilih
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<RawRSSI[]>([]);
  const [selectedRssi, setSelectedRssi] = useState<"rssi1" | "rssi2" | "rssi3">(
    "rssi1"
  );

  // ambil data monitoring dari API berdasarkan tanggal yang dipilih
  const setRSSIData = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const res = await getMonitoringData(formattedDate);
    console.log(res.data.data);
    setData(res.data.data);
  };

  // panggil api ulang setiap kali tanggal berubah
  useEffect(() => {
    setRSSIData().then();
  }, [selectedDate]);

  // ubah format tanggal agar bisa ditampilkan di input date
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ubah format timestamp jadi jam:menit untuk chart label
  const formatTime = (timestamp: Date): string => {
    return timestamp.toString().split("T")[1].toString().substring(0, 5);
  };

  // buat data scatter untuk chart rssi (tiap rssi berisi banyak nilai per timestamp)
  const scatterData = data.flatMap((item) => {
    console.log(item, "item");
    return item[selectedRssi].map((rssi) => ({
      time: new Date(item.timestamp).getTime(),
      value: rssi,
    }));
  });

  // ubah data api jadi format yang cocok untuk line chart (variance, median, mean)
  const chartData: ChartData[] = data.map((item) => ({
    time: formatTime(item.timestamp),
    variance1: item.variance1,
    variance2: item.variance2,
    variance3: item.variance3,
    median1: item.median1,
    median2: item.median2,
    median3: item.median3,
    mean1: item.mean1,
    mean2: item.mean2,
    mean3: item.mean3,
  }));

  const ChartCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );

  return (
    <SidebarContentLayout
      title="Monitoring"
      subtitle="View all detailed information"
    >
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-4 mb-6 border border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="date-selector"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Date:
                </label>
                <input
                  id="date-selector"
                  type="date"
                  value={formatDateForInput(selectedDate)}
                  max={formatDateForInput(new Date())}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">
                  Showing data for{" "}
                  {selectedDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* pemilihan jenis rssi */}
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-700">
                  Pilih RSSI:
                </span>
                {[
                  { key: "rssi1", label: "RSSI 1" },
                  { key: "rssi2", label: "RSSI 2" },
                  { key: "rssi3", label: "RSSI 3" },
                ].map((rssi) => (
                  <label key={rssi.key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rssi"
                      value={rssi.key}
                      checked={selectedRssi === rssi.key}
                      onChange={() => setSelectedRssi(rssi.key as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    {rssi.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* bagian chart utama */}
          <div className="space-y-6">
            <ChartCard title="RSSI Scatter (dBm)">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={(unixTime) =>
                      new Date(unixTime)
                        .toISOString()
                        .split("T")[1]
                        .substring(0, 5)
                    }
                  />
                  <YAxis dataKey="value" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    wrapperStyle={{ zIndex: 1000, outline: "none" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "3px",
                    }}
                    labelStyle={{ color: "#000" }}
                    labelFormatter={(unixTime) =>
                      `Time: ${new Date(unixTime)
                        .toISOString()
                        .split("T")[1]
                        .substring(0, 5)}`
                    }
                  />
                  <Legend />
                  <Scatter
                    name={selectedRssi.toUpperCase()}
                    data={scatterData}
                    fill={
                      selectedRssi === "rssi1"
                        ? "#3b82f6"
                        : selectedRssi === "rssi2"
                          ? "#10b981"
                          : "#f59e0b"
                    }
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 3 line chart untuk metric variance, median, dan mean */}
            {[
              {
                title: "Variance",
                keys: ["variance1", "variance2", "variance3"],
                names: ["Variance 1", "Variance 2", "Variance 3"],
              },
              {
                title: "Median (dBm)",
                keys: ["median1", "median2", "median3"],
                names: ["Median 1", "Median 2", "Median 3"],
              },
              {
                title: "Mean (dBm)",
                keys: ["mean1", "mean2", "mean3"],
                names: ["Mean 1", "Mean 2", "Mean 3"],
              },
            ].map((chart, idx) => (
              <ChartCard key={idx} title={chart.title}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      interval={Math.floor(chartData.length / 12)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chart.keys.map((key, i) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={["#3b82f6", "#10b981", "#f59e0b"][i]}
                        name={chart.names[i]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            ))}
          </div>
        </div>
      </div>
    </SidebarContentLayout>
  );
};

export default Monitoring;
