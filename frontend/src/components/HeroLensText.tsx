interface Props {
  scale: number
}

export default function HeroLensText({ scale }: Props) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
      }}
      className="
        text-center
        text-white
        dark:text-[#090a0d]
        will-change-transform
      "
    >
      <p
        className="
          mb-5
          text-sm
          font-medium
          uppercase
          tracking-[0.3em]
          text-white/60
          dark:text-zinc-600
        "
      >
        Personal Knowledge
      </p>

      <h1
        style={{
          fontFamily: '"HYZhengYuan95", sans-serif',
          fontSynthesis: "none",
        }}
        className="
          grid
          grid-cols-[auto_auto_auto]
          justify-center
          gap-[0.18em]

          text-[clamp(2.75rem,6.4vw,7.5rem)]
          leading-[1.05]
          font-extrabold
        "
      >
        <span
          className="
            text-center
            translate-x-[-1.8em]
          "
        >
          思考.
        </span>

        <span
          className="
            text-center
            translate-x-[-1em]
            -skew-x-10
          "
        >
          联结.
        </span>

        <span
          className="
            text-center
            translate-x-[0.80em]
            -skew-x-10
          "
        >
          留存.
        </span>
      </h1>
    </div>
  )
}
