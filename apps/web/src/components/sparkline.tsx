"use client";

import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import type { PricePoint } from "@/lib/mock-data";

interface SparklineProps {
  data: PricePoint[];
  dataKey?: "cardmarket" | "ebay" | "vinted";
  color?: string;
  days?: number;
}

export function Sparkline({
  data,
  dataKey = "cardmarket",
  color = "#D4AF58",
  days = 30,
}: SparklineProps) {
  const sliced = data.slice(-days);

  if (!sliced.length) {
    return <div className="h-10 w-20 flex items-center justify-center text-[10px] text-white/20">—</div>;
  }

  const first = sliced[0]?.[dataKey] ?? 0;
  const last = sliced[sliced.length - 1]?.[dataKey] ?? 0;
  const isUp = last >= first;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sliced}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={isUp ? "#22C55E" : "#EF4444"}
              strokeWidth={1.5}
              dot={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                fontSize: "10px",
                padding: "4px 8px",
              }}
              formatter={(v: any) => [`${Number(v).toFixed(2)}€`, ""]}
              labelFormatter={() => ""}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span className={`text-[11px] font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
        {isUp ? "+" : ""}{(((last - first) / first) * 100).toFixed(1)}%
      </span>
    </div>
  );
}
