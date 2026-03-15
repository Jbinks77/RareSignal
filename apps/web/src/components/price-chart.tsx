"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { PricePoint } from "@/lib/mock-data";

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  const [range, setRange] = useState<7 | 30 | 90>(30);

  const filtered = data.slice(-range);

  return (
    <div>
      {/* Range selector */}
      <div className="flex items-center gap-2 mb-4">
        {([7, 30, 90] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              range === r ? "bg-gold/15 text-gold" : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {r}j
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filtered}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            stroke="rgba(255,255,255,0.1)"
            tickFormatter={(v) => `${v}€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12121A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
            formatter={(value: any, name: any) => [
              `${Number(value).toFixed(2)}€`,
              name === "cardmarket" ? "Cardmarket" : name === "ebay" ? "eBay" : "Vinted",
            ]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            }
          />
          <Legend
            formatter={(value) =>
              value === "cardmarket" ? "Cardmarket" : value === "ebay" ? "eBay" : "Vinted"
            }
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="cardmarket"
            stroke="#D4AF58"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#D4AF58" }}
          />
          <Line
            type="monotone"
            dataKey="ebay"
            stroke="#8A5CF6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#8A5CF6" }}
          />
          <Line
            type="monotone"
            dataKey="vinted"
            stroke="#22C55E"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#22C55E" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
