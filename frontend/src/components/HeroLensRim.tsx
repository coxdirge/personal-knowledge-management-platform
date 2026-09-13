import { useId, useState } from "react"
import HeroTitle from "./HeroTitle"
import { CORE_RADIUS, LENS_RADIUS, LENS_SIZE, RIM_SIZE } from "./heroLensGeometry"

interface Props {
  x: number
  y: number
  scale: number
  titleCenter: number | string
}

// Build once, not on pointer movement. Red/green encode horizontal/vertical
// sampling offsets. Smooth radial bending vanishes at both ring boundaries.
function createDisplacementMap() {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = LENS_SIZE
  const context = canvas.getContext("2d")!
  const pixels = context.createImageData(LENS_SIZE, LENS_SIZE)
  for (let y = 0; y < LENS_SIZE; y++) {
    for (let x = 0; x < LENS_SIZE; x++) {
      const dx = x + 0.5 - LENS_RADIUS
      const dy = y + 0.5 - LENS_RADIUS
      const radius = Math.hypot(dx, dy)
      const t = Math.max(0, Math.min(1, (radius - CORE_RADIUS) / RIM_SIZE))
      // Sample inward by up to 7px: the glyph stretches over a convex glass rim.
      const displacement = -7 * Math.sin(Math.PI * t)
      const index = (y * LENS_SIZE + x) * 4
      pixels.data[index] = Math.round(255 * (0.5 + dx / (radius || 1) * displacement / 32))
      pixels.data[index + 1] = Math.round(255 * (0.5 + dy / (radius || 1) * displacement / 32))
      pixels.data[index + 2] = 128
      pixels.data[index + 3] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
  return canvas.toDataURL()
}

export default function HeroLensRim({ x, y, scale, titleCenter }: Props) {
  const filterId = useId().replace(/:/g, "")
  const [map] = useState(createDisplacementMap)
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={filterId} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"
            x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} result="radialMap" />
            <feDisplacementMap in="SourceGraphic" in2="radialMap" scale="32"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {/* The mask is outside the filter: displaced pixels can never leak outside
          the ring. A viewport-width replica keeps the original word layout. */}
      <div data-lens-rim className="absolute" style={{
        left: x - LENS_RADIUS, top: y - LENS_RADIUS,
        width: LENS_SIZE, height: LENS_SIZE,
        maskImage: `radial-gradient(circle, transparent ${CORE_RADIUS}px, black ${CORE_RADIUS}px, black ${LENS_RADIUS}px, transparent ${LENS_RADIUS}px)`,
      }}>
        <div style={{ width: LENS_SIZE, height: LENS_SIZE, filter: `url(#${filterId})` }}>
          <div className="absolute" style={{
            left: LENS_RADIUS - x, top: LENS_RADIUS - y,
            width: "100vw", height: "100svh",
          }}>
            <div className="absolute inset-x-6 sm:inset-x-10" style={{
              top: titleCenter, transform: "translateY(-50%)",
            }}>
              <HeroTitle scale={scale} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
