"use client";

const BASE_INPUT =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50";

interface CampoTextoProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}

export function CampoTexto({ label, value, onChange, multiline, type = "text" }: CampoTextoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${BASE_INPUT} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={BASE_INPUT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

interface OpcaoSelect {
  value: string;
  label: string;
}

interface CampoSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: OpcaoSelect[];
  placeholder?: string;
}

export function CampoSelect({ label, value, onChange, opcoes, placeholder }: CampoSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <select
        className={`${BASE_INPUT} cursor-pointer`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CampoToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function CampoToggle({ label, value, onChange }: CampoToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
        <span className={`text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>
          {value ? "SIM" : "NÃO"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ml-auto ${
            value ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
