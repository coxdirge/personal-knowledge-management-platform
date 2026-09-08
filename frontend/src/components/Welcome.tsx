import {
  useEffect
} from "react"

interface Props {
  onComplete: () => void
}

export default function Welcome({
  onComplete
}: Props) {

  useEffect(() => {

    const timer =
      setTimeout(
        onComplete,
        2000
      )

    return () =>
      clearTimeout(timer)

  }, [onComplete])

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-white
      "
    >
      <h1
        className="
          text-6xl
          font-semibold
          tracking-tight
          animate-[welcome_2s_ease-in-out_forwards]
        "
      >
        Hello.
      </h1>
    </div>
  )
}
