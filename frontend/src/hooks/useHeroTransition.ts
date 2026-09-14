import { useLayoutEffect, useRef, useState } from "react"

// One source of truth for typography, reserved header space, and scroll timing.
const COMPACT_SCALE = 0.82
const MORPH_SCREENS = 0.35
const TITLE_WORKSPACE_GAP = 104
const TITLE_REST_CENTER = 1 / 3

export default function useHeroTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState({
    progress: 0,
    viewport: 0,
    compact: 0,
    workspace: 0,
  })

  useLayoutEffect(() => {
    let frame = 0
    const measure = () => {
      const section = sectionRef.current
      const title = titleRef.current
      const workspace = workspaceRef.current
      if (!section || !title || !workspace) return

      const viewport = document.documentElement.clientHeight
      const progress = Math.min(
        1,
        Math.max(
          0,
          -section.getBoundingClientRect().top / (viewport * MORPH_SCREENS),
        ),
      )
      const next = {
        progress,
        viewport,
        // Reserve only the title's bottom edge + a fixed workspace gap.
        // Title position is independent of this space; offsetHeight ignores scale.
        compact:
          viewport * TITLE_REST_CENTER +
          (title.offsetHeight * COMPACT_SCALE) / 2 +
          TITLE_WORKSPACE_GAP,
        workspace: workspace.offsetHeight,
      }
      setGeometry(current =>
        current.progress === next.progress &&
        current.viewport === next.viewport &&
        current.compact === next.compact &&
        current.workspace === next.workspace
          ? current
          : next,
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    // Restore scroll before paint; remeasure after resizing, font loading, or editing.
    measure()
    const observer = new ResizeObserver(schedule)
    if (titleRef.current) observer.observe(titleRef.current)
    if (workspaceRef.current) observer.observe(workspaceRef.current)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  const { progress, viewport, compact, workspace } = geometry
  // One linear scroll mapping for position, scale, and spacing. Mixing an eased
  // height with a linear opening offset caused a small reversal at both ends.
  const openingCenter = viewport / 2 - 32
  const restingCenter = viewport * TITLE_REST_CENTER
  return {
    sectionRef,
    titleRef,
    workspaceRef,
    progress,
    scale: 1 + (COMPACT_SCALE - 1) * progress,
    titleCenter: viewport
      ? openingCenter + (restingCenter - openingCenter) * progress
      : "calc(50% - 32px)",
    titleHeight: viewport
      ? viewport + (compact - viewport) * progress
      : "100svh",
    // Follow page scroll only while morphing. At the endpoint this offset stops,
    // so the heading and workspace immediately scroll away together (and reverse).
    stageOffset: progress * viewport * MORPH_SCREENS,
    // Explicit track stays stable while the visual header shrinks.
    sectionHeight: viewport
      ? workspace + compact + viewport * MORPH_SCREENS
      : undefined,
  }
}
