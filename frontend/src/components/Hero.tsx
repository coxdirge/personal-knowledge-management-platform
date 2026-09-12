import type { ReactNode } from "react"
import HeroTitle from "./HeroTitle"
import useHeroTransition from "../hooks/useHeroTransition"

interface Props {
  children: ReactNode
}

export default function Hero({ children }: Props) {
  const {
    sectionRef, titleRef, workspaceRef,
    progress, scale, titleCenter, titleHeight, sectionHeight, stageOffset,
  } = useHeroTransition()

  return (
    <section
      ref={sectionRef}
      aria-label="Knowledge and notes"
      className="relative min-h-screen overflow-clip"
      style={{ height: sectionHeight, overflowAnchor: "none" }}
    >
      {/* Follow scroll during the morph, then stop compensating: both regions leave
          together. Clip the initial offscreen workspace to the stable scroll track. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ transform: `translateY(${stageOffset}px)` }}
      >
        <header
          className="relative flex items-center justify-center px-6 sm:px-10"
          style={{ height: titleHeight }}
        >
          {/* Position the title independently of header height, preserving its
              one-third landing point while bringing the workspace closer. */}
          <div
            ref={titleRef}
            className="absolute inset-x-6 sm:inset-x-10"
            style={{ top: titleCenter, transform: "translateY(-50%)" }}
          >
            <HeroTitle scale={scale} />
          </div>
          <p
            className="pointer-events-none absolute bottom-8 text-sm text-gray-400"
            style={{ opacity: Math.max(0, 1 - progress * 4) }}
          >
            Scroll to explore
          </p>
        </header>
        {/* The heading reserves real space above the workspace, with no overlay. */}
        <div ref={workspaceRef}>{children}</div>
      </div>
    </section>
  )
}
