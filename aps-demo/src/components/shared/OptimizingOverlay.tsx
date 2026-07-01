'use client'

export function OptimizingOverlay() {
  return (
    <div
      className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3 z-10"
      style={{ backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(2px)' }}
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              animation: `bounce 0.9s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color: '#93c5fd' }}>
        重新优化中…
      </p>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
