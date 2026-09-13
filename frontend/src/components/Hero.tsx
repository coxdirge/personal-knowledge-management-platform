import { useEffect, useRef, useState } from "react"

import type {
  ReactNode,
} from "react"

import HeroLens from "./HeroLens"
import { CORE_RADIUS, LENS_RADIUS } from "./heroLensGeometry"
import HeroTitle from "./HeroTitle"
import useHeroTransition from "../hooks/useHeroTransition"
import HeroLensText from "./HeroLensText"

interface Props {
  children: ReactNode
}

export default function Hero({ children }: Props) {
  const {
    sectionRef, titleRef, workspaceRef,
    progress, scale, titleCenter, titleHeight, sectionHeight, stageOffset,
  } = useHeroTransition()

  const interactionRef = useRef<HTMLDivElement>(null)

  const targetLensPosition = useRef({ x: 0, y: 0 })
  const currentLensPosition = useRef({ x: 0, y: 0 })

  const [lensPosition, setLensPosition] =
    useState({
      x: 0,
      y: 0,
    })

  const [lensVisible, setLensVisible] =
    useState(false)

  const lensFadeStart = 0.45
  const lensFadeEnd = 0.9

  const lensOpacity =
    progress <= lensFadeStart
      ? 1
      : progress >= lensFadeEnd
        ? 0
        : 1 -
          (
            (progress - lensFadeStart) /
            (lensFadeEnd - lensFadeStart)
          )


  useEffect(() => {
    let frame = 0
    let lastTime: number | null = null
    let inside = false
    let pointer: { x: number; y: number } | null = null
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const leave = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = null
      pointer = null
      inside = false
      setLensVisible(false)
    }

    // One loop owns both coordinate sampling and inertia. Mouse events only
    // store the latest client position: at most one layout read per frame.
    const animate = (time: number) => {
      frame = 0
      if (pointer) {
        const rect = interactionRef.current?.getBoundingClientRect()
        if (!rect) { leave(); return }
        const next = { x: pointer.x - rect.left, y: pointer.y - rect.top }
        pointer = null
        if (next.x < 0 || next.x > rect.width || next.y < 0 || next.y > rect.height) {
          leave()
          return
        }
        targetLensPosition.current = next
        if (!inside) {
          // Entry/re-entry snaps to the pointer instead of flying from an old
          // position. Later movement uses inertia; scroll alone never hides it.
          currentLensPosition.current = { ...next }
          inside = true
          setLensVisible(true)
        }
      }
      if (!inside) return

      const target = targetLensPosition.current
      const current = currentLensPosition.current
      const elapsed = lastTime === null ? 1000 / 60 : Math.min(time - lastTime, 64)
      lastTime = time
      // 0.14 at 60Hz; time normalization keeps 120Hz screens equally weighty.
      const easing = reducedMotion.matches ? 1 : 1 - Math.pow(1 - 0.14, elapsed / (1000 / 60))
      current.x += (target.x - current.x) * easing
      current.y += (target.y - current.y) * easing
      const settled = Math.hypot(target.x - current.x, target.y - current.y) < 0.1
      if (settled) { current.x = target.x; current.y = target.y }
      setLensPosition({ ...current })
      // Stop at rest, restart on movement. No permanent animation/render loop.
      if (settled) lastTime = null
      else frame = requestAnimationFrame(animate)
    }

    const move = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(animate)
    }
    window.addEventListener("mousemove", move)
    document.documentElement.addEventListener("mouseleave", leave)
    window.addEventListener("blur", leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", move)
      document.documentElement.removeEventListener("mouseleave", leave)
      window.removeEventListener("blur", leave)
    }
  }, [])

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

        {/* Stable opening-viewport coordinates, independent of titleHeight.
            Pointer events pass through to the workspace below. */}
        <div
          ref={interactionRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-svh"
        >
          {/* ================= HERO LENS ================= */}
          <HeroLens
            scale={scale}
            titleCenter={titleCenter}
            x={lensPosition.x}
            y={lensPosition.y}
            opacity={
              lensVisible
                ? lensOpacity
                : 0
            }
          >
            <div
              className="
                absolute
                inset-x-6
                sm:inset-x-10
              "
              style={{
                top: titleCenter,
                transform: "translateY(-50%)",
              }}
            >
              <HeroLensText
                scale={scale}
              />
            </div>
          </HeroLens>


        </div>

        <header
          className="
            relative
            flex
            items-center
            justify-center
            px-6
            sm:px-10
          "
          style={{
            height: titleHeight,
          }}
        >

          {/* ================= BASE HERO TITLE ================= */}
          <div
            ref={titleRef}
            className="
              absolute
              inset-x-6
              sm:inset-x-10
            "
            style={{
              top: titleCenter,
              transform: "translateY(-50%)",
              // The cutout follows the rendered lens, never the cursor target.
              // Restore the ring-only mask to prevent duplicate English ink.
              maskImage: `radial-gradient(circle at calc(${lensPosition.x}px - (100vw - 100%) / 2) calc(${lensPosition.y}px - ${typeof titleCenter === "number" ? `${titleCenter}px` : titleCenter} + 50%), black ${CORE_RADIUS}px, rgba(0,0,0,${1 - (lensVisible ? lensOpacity : 0)}) ${CORE_RADIUS}px, rgba(0,0,0,${1 - (lensVisible ? lensOpacity : 0)}) ${LENS_RADIUS}px, black ${LENS_RADIUS}px)`,
            }}
          >
            <HeroTitle scale={scale} />
          </div>


          {/* ================= SCROLL CUE ================= */}
          <p
            className="
              pointer-events-none
              absolute
              bottom-8
              text-sm
              text-gray-400 dark:text-zinc-400
            "
            style={{
              opacity:
                Math.max(
                  0,
                  1 - progress * 4
                ),
            }}
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
