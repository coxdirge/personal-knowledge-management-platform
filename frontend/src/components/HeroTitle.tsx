interface Props {
  scale: number
  inverted?: boolean
}

export default function HeroTitle({
  scale,
  inverted = false,
}: Props) {

  return (
    <div
      style={{
        transform: `scale(${scale})`,
      }}
      className="
        text-center
        will-change-transform dark:text-zinc-100
      "
    >
      <p
        className={`
          mb-5
          text-sm
          font-medium
          uppercase
          tracking-[0.3em]

          ${
            inverted
              ? "text-white/70"
              : "text-gray-500 dark:text-zinc-400"
          }
        `}
      >
        Personal Knowledge
      </p>

      <h1
        style={{
          fontFamily: '"Archivo", sans-serif',
        }}
        className="
          grid
          grid-cols-[auto_auto_auto]
          justify-center
          gap-[0.12em]
          text-[clamp(2.75rem,6.4vw,7.5rem)]
          leading-[0.95]
          font-black
          italic
          tracking-[-0.04em]
        "
      >
        <span>Think.</span>
        <span>Connect.</span>
        <span>Remember.</span>

      </h1>

    </div>
  )
}
