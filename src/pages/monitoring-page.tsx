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

interface ScatterPoint {
  time: string;
  value: number;
}

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

const generateDailyMockData = (selectedDate: Date): RawRSSI[] => {
  const data: RawRSSI[] = [];
  const startTime = new Date(selectedDate);
  startTime.setHours(8, 0, 0, 0);

  const endTime = new Date(selectedDate);
  endTime.setHours(17, 0, 0, 0);

  const duration = endTime.getTime() - startTime.getTime();
  const interval = 5 * 60 * 1000;
  const dataPoints = Math.floor(duration / interval);

  let rssi1Base = -65;
  let rssi2Base = -60;
  let rssi3Base = -70;
  let variance1Base = 25;
  let variance2Base = 20;
  let variance3Base = 30;

  for (let i = 0; i <= dataPoints; i++) {
    const timestamp = new Date(startTime.getTime() + i * interval);

    rssi1Base += (Math.random() - 0.5) * 1;
    rssi2Base += (Math.random() - 0.5) * 1;
    rssi3Base += (Math.random() - 0.5) * 1;
    variance1Base += (Math.random() - 0.5) * 2;
    variance2Base += (Math.random() - 0.5) * 2;
    variance3Base += (Math.random() - 0.5) * 2;

    rssi1Base = Math.max(-75, Math.min(-55, rssi1Base));
    rssi2Base = Math.max(-70, Math.min(-50, rssi2Base));
    rssi3Base = Math.max(-80, Math.min(-60, rssi3Base));
    variance1Base = Math.max(15, Math.min(35, variance1Base));
    variance2Base = Math.max(10, Math.min(30, variance2Base));
    variance3Base = Math.max(20, Math.min(40, variance3Base));

    data.push({
      timestamp,
      rssi1: Array.from(
        { length: 7 },
        () => rssi1Base + (Math.random() - 0.5) * 3
      ),
      rssi2: Array.from(
        { length: 7 },
        () => rssi2Base + (Math.random() - 0.5) * 3
      ),
      rssi3: Array.from(
        { length: 7 },
        () => rssi3Base + (Math.random() - 0.5) * 3
      ),
      variance1: variance1Base,
      variance2: variance2Base,
      variance3: variance3Base,
      median1: rssi1Base + (Math.random() - 0.5) * 2,
      median2: rssi2Base + (Math.random() - 0.5) * 2,
      median3: rssi3Base + (Math.random() - 0.5) * 2,
      mean1: rssi1Base + (Math.random() - 0.5) * 2,
      mean2: rssi2Base + (Math.random() - 0.5) * 2,
      mean3: rssi3Base + (Math.random() - 0.5) * 2,
    });
  }

  return data;
};

const Monitoring = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<RawRSSI[]>([]);
  const [selectedRssi, setSelectedRssi] = useState<"rssi1" | "rssi2" | "rssi3">(
    "rssi1"
  );

  useEffect(() => {
    const newData = generateDailyMockData(selectedDate);
    setData(newData);
  }, [selectedDate]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === Buat data scatter untuk RSSI ===
  const scatterData: ScatterPoint[] = data.flatMap((item) =>
    item[selectedRssi].map((val) => ({
      time: formatTime(item.timestamp),
      value: val,
    }))
  );

  // === Data untuk chart lainnya ===
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
              {/* Date Selector */}
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

              {/* RSSI Selector */}
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

          <div className="space-y-6">
            {/* Scatter RSSI */}
            <ChartCard title="RSSI Scatter (dBm)">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" type="category" />
                  <YAxis dataKey="value" />
                  <Tooltip />
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

            {/* Variance, Median, Mean tetap pakai LineChart */}
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
