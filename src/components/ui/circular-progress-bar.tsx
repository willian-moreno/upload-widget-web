interface CircularProgressBarProps {
  progress: number
  size?: number
  strokeWidth?: number
  circleColor?: string
  progressColor?: string
}

export function CircularProgressBar({
  progress,
  size = 120,
  strokeWidth = 8,
  circleColor = 'text-zinc-800',
  progressColor = 'text-indigo-500',
}: CircularProgressBarProps) {
  const center = size / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (progress / 100) * circumference

  return (
    <div
      className="relative"
      style={{ height: size, width: size }}
    >
      <svg
        className="h-full w-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <title className="sr-only">{`Progresso ${progress}%`}</title>
        <circle
          className={`${circleColor} stroke-current`}
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={`${progressColor} stroke-current`}
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: progressOffset,
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center font-medium text-xs text-zinc-50`}
      >
        {progress}
        <span className="text-xxs text-zinc-400">%</span>
      </div>
    </div>
  )
}
