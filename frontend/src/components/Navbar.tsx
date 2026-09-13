import useTheme from "../hooks/useTheme"

const navItemClass = `
  flex
  w-full
  items-center
  justify-center

  rounded-xl
  border
  border-white/50
  bg-white/30 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 dark:focus-visible:outline-2 dark:focus-visible:outline-white/40
  px-3
  py-2

  text-sm
  transition-all
  duration-200

  shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.55)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
  backdrop-blur-md

  hover:-translate-y-0.5
  hover:bg-white/45
  hover:border-white/70
`

const iconButtonClass = `
  flex
  w-full
  items-center
  justify-center

  rounded-xl
  border
  border-white/50
  bg-white/30 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 dark:focus-visible:outline-2 dark:focus-visible:outline-white/40
  px-3
  py-2

  transition-all
  duration-200

  shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.55)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
  backdrop-blur-md

  hover:-translate-y-0.5
  hover:bg-white/45
  hover:border-white/70
`

export default function Navbar() {

  const {
    theme,
    toggleTheme,
  } = useTheme()

  return (
    <nav
      className="
        fixed
        left-1/2
        top-5
        z-50
        w-[min(82vw,900px)]
        -translate-x-1/2

        rounded-3xl
        border
        border-white/45
        bg-white/18 dark:bg-[#14161c]/80 dark:border-white/15 dark:text-zinc-100
        px-5
        py-4

        shadow-[0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
        backdrop-blur-2xl
      "
    >
      <div
        className="
          grid
          w-full
          grid-cols-7
          items-center
          gap-3
        "
      >
        {/* ================= BRAND ================= */}
        <button
          type="button"
          className={`
            ${navItemClass}
            font-semibold
            tracking-[0.16em]
            text-black dark:text-zinc-100
          `}
        >
          PKMP
        </button>

        {/* ================= NAVIGATION ================= */}
        <button
          type="button"
          className={`
            ${navItemClass}
            font-medium
            text-black dark:text-zinc-100
          `}
        >
          Notes
        </button>

        <button
          type="button"
          className={`
            ${navItemClass}
            text-gray-500 dark:text-zinc-400 dark:hover:text-zinc-100
            hover:text-black
          `}
        >
          Search
        </button>

        <button
          type="button"
          className={`
            ${navItemClass}
            text-gray-500 dark:text-zinc-400 dark:hover:text-zinc-100
            hover:text-black
          `}
        >
          Graph
        </button>

        {/* ================= AI ================= */}
        <button
          type="button"
          aria-label="AI"
          className={iconButtonClass}
        >
          AI
        </button>

        {/* ================= THEME ================= */}
        <button
          type="button"
          aria-label={`Switch to ${
            theme === "light"
              ? "dark"
              : "light"
          } mode`}
          onClick={toggleTheme}
          className={iconButtonClass}
        >
          {theme === "light" ? "◐" : "◑"}
        </button>

        {/* ================= ACCOUNT ================= */}
        <button
          type="button"
          className={`
            ${navItemClass}
            font-medium
            text-black dark:text-zinc-100
          `}
        >
          Login
        </button>
      </div>
    </nav>
  )
}
