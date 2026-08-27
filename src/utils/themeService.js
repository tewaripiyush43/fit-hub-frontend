/**
 * FitHub Theme System
 * Defines fitness-tailored visual themes and handles reactive theme switching.
 */

export const THEMES = [
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    purpose: "High-Tech AI & Energy",
    description: "Electric cyan and deep space surfaces for high-energy AI precision.",
    accent: "#00e5ff",
    accentHover: "#00c7de",
    bgBase: "#0a0c14",
    bgSurface: "#121522",
    badge: "Default",
    emoji: "⚡",
  },
  {
    id: "volcanic-pump",
    name: "Volcanic Pump",
    purpose: "Hypertrophy & Heavy Lifting",
    description: "Crimson fire and obsidian shadows engineered for maximum muscle pump.",
    accent: "#ff3366",
    accentHover: "#ff1744",
    bgBase: "#0e080b",
    bgSurface: "#1a1015",
    badge: "Maximum Pump",
    emoji: "🔥",
  },
  {
    id: "toxic-gainz",
    name: "Toxic Gainz",
    purpose: "Pre-Workout Surge & Stamina",
    description: "Radioactive neon lime and cyber emerald for high-voltage conditioning.",
    accent: "#b8ff00",
    accentHover: "#a2e600",
    bgBase: "#080e0a",
    bgSurface: "#101c14",
    badge: "High Voltage",
    emoji: "🧪",
  },
  {
    id: "golden-olympia",
    name: "Golden Olympia",
    purpose: "Championship & Elite PRs",
    description: "Sandow trophy gold and warm bronze slate celebrating champion physiques.",
    accent: "#ffd700",
    accentHover: "#f59e0b",
    bgBase: "#0e0c08",
    bgSurface: "#1b160e",
    badge: "Prestige",
    emoji: "🏆",
  },
  {
    id: "midnight-stealth",
    name: "Midnight Stealth",
    purpose: "Underground Dungeon & Steel",
    description: "Ice steel blue and raw cast iron for pure focus, chalk dust, and heavy metal.",
    accent: "#38bdf8",
    accentHover: "#0ea5e9",
    bgBase: "#070709",
    bgSurface: "#101217",
    badge: "Raw Iron",
    emoji: "⛓️",
  },
];

const STORAGE_KEY = "fithub_theme";
const DEFAULT_THEME = "cyber-cyan";

export function getStoredTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEY);
  const exists = THEMES.some((t) => t.id === stored);
  return exists ? stored : DEFAULT_THEME;
}

export function applyTheme(themeId) {
  if (typeof window === "undefined") return;
  const targetTheme = THEMES.some((t) => t.id === themeId) ? themeId : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", targetTheme);
  localStorage.setItem(STORAGE_KEY, targetTheme);
  window.dispatchEvent(new CustomEvent("fithub:theme-change", { detail: { themeId: targetTheme } }));
}

// Auto-initialize theme immediately on script evaluation to prevent any flash
if (typeof window !== "undefined") {
  const initialTheme = getStoredTheme();
  document.documentElement.setAttribute("data-theme", initialTheme);
}
