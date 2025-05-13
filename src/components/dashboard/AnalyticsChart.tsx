"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false });

// Dynamically import Chart.js modules for tree-shaking
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AnalyticsChartProps {
  type: "revenue" | "users";
  range?: string;
}

export default function AnalyticsChart({ type, range = "30d" }: AnalyticsChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/dashboard?range=${range}`, { credentials: "include" });
      const data = await res.json();
      // Simulate data for the selected range
      const now = new Date();
      let labels: string[] = [];
      let values: number[] = [];
      if (range === "7d") {
        labels = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - 6 + i);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        });
        if (type === "revenue") {
          const base = data.totalRevenue / 7;
          values = Array.from({ length: 7 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        } else {
          const base = data.totalUsers / 7;
          values = Array.from({ length: 7 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        }
      } else if (range === "30d") {
        labels = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - 29 + i);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        });
        if (type === "revenue") {
          const base = data.totalRevenue / 30;
          values = Array.from({ length: 30 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        } else {
          const base = data.totalUsers / 30;
          values = Array.from({ length: 30 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        }
      } else {
        labels = Array.from({ length: 12 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
          return d.toLocaleString("default", { month: "short", year: "2-digit" });
        });
        if (type === "revenue") {
          const base = data.totalRevenue / 12;
          values = Array.from({ length: 12 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        } else {
          const base = data.totalUsers / 12;
          values = Array.from({ length: 12 }, () => Math.round(base * (0.8 + Math.random() * 0.6)));
        }
      }
      setChartData({
        labels,
        datasets: [
          {
            label: type === "revenue" ? "Revenue (PKR)" : "New Users",
            data: values,
            fill: true,
            backgroundColor: type === "revenue" ? "rgba(56,189,248,0.15)" : "rgba(99,102,241,0.15)",
            borderColor: type === "revenue" ? "#0ea5e9" : "#6366f1",
            pointBackgroundColor: "#fff",
            pointBorderColor: type === "revenue" ? "#0ea5e9" : "#6366f1",
            tension: 0.4,
          },
        ],
      });
      setLoading(false);
    };
    fetchData();
  }, [type, range]);

  if (loading || !chartData) return <div className="h-64 flex items-center justify-center text-gray-400 animate-pulse bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl">Loading chart...</div>;

  return (
    <div className="h-full w-full">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#64748b", font: { weight: "bold" } },
            },
            y: {
              grid: { color: "#f1f5f9" },
              ticks: { color: "#64748b" },
            },
          },
        }}
        height={260}
      />
    </div>
  );
} 