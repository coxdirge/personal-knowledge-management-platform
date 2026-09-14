import { useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "pkmp-theme"

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (saved === "light" || saved === "dark") {
    return saved
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => (current === "light" ? "dark" : "light"))
  }

  return {
    theme,
    toggleTheme,
  }
}
