import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useThemeStore = defineStore("theme", () => {
  // Check localStorage or system preference for initial theme
  const getInitialTheme = (): "light" | "dark" => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      return stored
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  }

  const theme = ref<"light" | "dark">(getInitialTheme())
  const isDark = ref(theme.value === "dark")

  // Apply theme to document
  function applyTheme(newTheme: "light" | "dark") {
    const root = document.documentElement
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }

  // Toggle theme
  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light"
    isDark.value = theme.value === "dark"
    applyTheme(theme.value)
  }

  // Set specific theme
  function setTheme(newTheme: "light" | "dark") {
    theme.value = newTheme
    isDark.value = newTheme === "dark"
    applyTheme(newTheme)
  }

  // Watch for changes and apply
  watch(
    theme,
    (newTheme) => {
      applyTheme(newTheme)
    },
    { immediate: true },
  )

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }
})
