"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COR_ANALISAR = "#EAB308";
const COR_PARTICIPAR = "#7B61FF";

interface Ponto {
  data: string;
  ANALISAR: number;
  PARTICIPAR: number;
}

interface GraficoAberturaProps {
  dados: Ponto[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md min-w-[140px]">
      <p className="text-xs font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name === "ANALISAR" ? "Analisar" : "Participar"}
          </span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
      {payload.length > 1 && (
        <div className="flex items-center justify-between gap-4 text-xs border-t border-border mt-1.5 pt-1.5">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold text-foreground">{total}</span>
        </div>
      )}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center gap-4 justify-end pr-2">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COR_ANALISAR }} />
        <span className="text-xs text-muted-foreground">Analisar</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COR_PARTICIPAR }} />
        <span className="text-xs text-muted-foreground">Participar</span>
      </div>
    </div>
  );
}

export function GraficoAbertura({ dados }: GraficoAberturaProps) {
  if (dados.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">Nenhuma licitação em Analisar ou Participar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <CustomLegend />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={dados}
          barSize={dados.length > 15 ? 16 : 28}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="data"
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
          <Bar dataKey="ANALISAR" stackId="a" fill={COR_ANALISAR} fillOpacity={0.85} radius={[0, 0, 0, 0]} />
          <Bar dataKey="PARTICIPAR" stackId="a" fill={COR_PARTICIPAR} fillOpacity={0.85} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
