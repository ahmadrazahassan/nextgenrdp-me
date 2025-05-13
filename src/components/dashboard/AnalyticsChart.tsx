"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface AnalyticsChartProps {
  type: string;
  range: string;
}

export default function AnalyticsChart({ type, range }: AnalyticsChartProps) {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500">Chart: {type} data for {range}</p>
    </div>
  );
} 