"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LiveMonitoringChart() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("Visual Analysis");

  const data = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5} min`,
    voltage: parseFloat((11.8 + Math.random() * 1).toFixed(1)),
    temperature: parseFloat((45 + i * 0.4).toFixed(1)),
  }));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          📊 Live Power Line Monitoring
        </h3>
        <div>
          <select
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option>Visual Analysis</option>
            <option>Thermal Analysis</option>
            <option>Structural Analysis</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#465fff"
              name="Voltage Stability (V)"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ff4757"
              name="Temperature (°C)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
