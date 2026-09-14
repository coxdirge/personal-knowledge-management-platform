import type { ReactNode } from "react"

import HeroLensRim from "./HeroLensRim"
import { LENS_SIZE, RIM_SIZE, CORE_RADIUS } from "./heroLensGeometry"

interface Props {
  x: number
  y: number
  opacity: number
  children: ReactNode
  scale: number
  titleCenter: number | string
}

export default function HeroLens({
  x,
  y,
  opacity,
  children,
  scale,
  titleCenter,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
      "
      style={{
        opacity,
        transition: "opacity 180ms ease",
      }}
    >
      <HeroLensRim x={x} y={y} scale={scale} titleCenter={titleCenter} />

      {/* ================= LENS BODY ================= */}
      <div
        className="
          absolute
          rounded-full
        "
        style={{
          width: LENS_SIZE,
          height: LENS_SIZE,
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* ================= REFRACTIVE RIM ================= */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border
            border-white/5
          "
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.04),
                rgba(255,255,255,0.008) 35%,
                rgba(255,255,255,0.002) 65%,
                rgba(255,255,255,0.012)
              )
            `,
          }}
        />

        {/* ================= CONTRAST CORE ================= */}
        <div
          className="
            absolute
            rounded-full
            bg-black
            dark:bg-zinc-100
            dark:bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.98),rgba(244,245,248,0.92)_55%,rgba(215,220,230,0.82)_100%)]
            dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-8px_18px_rgba(30,40,60,0.08)]
          "
          style={{
            inset: RIM_SIZE,
          }}
        />
      </div>

      {/* ================= CHINESE SEMANTIC CORE ================= */}
      <div
        className="
          absolute
          inset-0
        "
        style={{
          clipPath: `
            circle(
              ${CORE_RADIUS}px
              at ${x}px ${y}px
            )
          `,
        }}
      >
        {children}
      </div>
    </div>
  )
}
