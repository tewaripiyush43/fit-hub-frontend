import { useState, useEffect } from "react";
import { THEMES, getStoredTheme, applyTheme } from "../utils/themeService";

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e?.detail?.themeId) {
        setCurrentTheme(e.detail.themeId);
      }
    };

    window.addEventListener("fithub:theme-change", handleThemeChange);
    return () => window.removeEventListener("fithub:theme-change", handleThemeChange);
  }, []);

  const setTheme = (themeId) => {
    applyTheme(themeId);
    setCurrentTheme(themeId);
  };

  const activeThemeObject = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return {
    currentTheme,
    setTheme,
    themes: THEMES,
    activeTheme: activeThemeObject,
  };
}

export default useTheme;
