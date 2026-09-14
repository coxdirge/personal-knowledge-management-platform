import useTheme from "../hooks/useTheme"
import "./Navbar.css"

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      className="
        pkmp-navigation
      "
    >
      <nav
        className="
          pkmp-nav-glass
        "
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="
            pkmp-brand
          "
        >
          PKMP
        </button>
        <div
          className="
            pkmp-nav-items
          "
        >
          <button
            type="button"
            className="
              pkmp-nav-pill
              pkmp-nav-active
            "
          >
            Notes
          </button>
          <button
            type="button"
            className="
              pkmp-nav-pill
            "
          >
            Search
          </button>
          <button
            type="button"
            className="
              pkmp-nav-pill
            "
          >
            Graph
          </button>
          <button
            type="button"
            className="
              pkmp-nav-pill
            "
            aria-label="AI"
          >
            AI
          </button>
        </div>
        <button
          type="button"
          className="
            pkmp-nav-pill
            pkmp-account
          "
        >
          Login
        </button>
      </nav>
      <button
        type="button"
        role="switch"
        aria-checked={theme === "dark"}
        aria-label="Dark mode"
        onClick={toggleTheme}
        className="
          pkmp-theme-switch
        "
      >
        <span
          aria-hidden="true"
          className="
            pkmp-theme-thumb
          "
        />
      </button>
    </div>
  )
}
