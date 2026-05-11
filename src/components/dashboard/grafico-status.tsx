"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GraficoStatusProps {
  dados: { status: string; total: number; cor: string }[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { status: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{payload[0].payload.status}</p>
      <p className="text-sm font-semibold text-foreground">{payload[0].value} licitações</p>
    </div>
  );
}

export function GraficoStatus({ dados }: GraficoStatusProps) {
  if (dados.every((d) => d.total === 0)) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">Nenhum dado para exibir</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={dados} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="status"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {dados.map((entry, i) => (
            <Cell key={i} fill={entry.cor} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
