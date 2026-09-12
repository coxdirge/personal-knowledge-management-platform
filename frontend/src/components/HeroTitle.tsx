interface Props {
  scale: number
}

export default function HeroTitle({ scale }: Props) {
  return (
    <div
      style={{ transform: `scale(${scale})` }}
      className="text-center will-change-transform"
    >
      <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
        Personal Knowledge
      </p>
      {/* Fluid display typography stays prominent at rest; wrap only between phrases. */}
      <h1 className="text-[clamp(2.75rem,6.4vw,7.5rem)] leading-[1.05] font-semibold tracking-[-0.045em]">
        <span className="inline-block">Think.</span>{" "}
        <span className="inline-block">Connect.</span>{" "}
        <span className="inline-block">Remember.</span>
      </h1>
    </div>
  )
}
