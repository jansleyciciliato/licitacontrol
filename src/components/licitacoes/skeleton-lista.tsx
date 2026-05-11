export function SkeletonLista() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-5 py-3 flex gap-8">
        {["w-20", "w-16", "w-40", "w-20", "w-16"].map((w, i) => (
          <div key={i} className={`h-3 ${w} rounded bg-muted animate-pulse`} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`flex gap-8 px-5 py-4 ${i !== 0 ? "border-t border-border" : ""}`}>
          <div className="h-4 w-36 rounded bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse hidden sm:block" />
          <div className="h-4 w-56 rounded bg-muted animate-pulse hidden lg:block" />
          <div className="h-4 w-20 rounded bg-muted animate-pulse hidden md:block" />
          <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
