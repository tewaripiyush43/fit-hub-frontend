import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import BoltIcon from "@mui/icons-material/Bolt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PlateCalculatorModal from "./PlateCalculatorModal";
import PreWorkoutWarmupModal from "./PreWorkoutWarmupModal";
import { THEMES, applyTheme } from "../utils/themeService";
import { portalActions } from "../store/index";
import { toast } from "../helpers/errorPopUp";

import "../styles/_quickCommandPalette.scss";

const QuickCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [isWarmupModalOpen, setIsWarmupModalOpen] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const actions = useMemo(() => [
    {
      id: "plate_calculator",
      title: "Visual Barbell Plate Calculator",
      subtitle: "Instant color-coded Olympic plate loading diagrams",
      icon: <FitnessCenterIcon style={{ color: "#f59e0b" }} />,
      shortcut: "L",
      action: () => setIsPlateModalOpen(true),
    },
    {
      id: "anatomy",
      title: "2D Muscle Anatomy Map",
      subtitle: "Interactive biomechanics, target cues & stretches",
      icon: <AccessibilityNewIcon style={{ color: "#00f0ff" }} />,
      shortcut: "N",
      action: () => navigate("/anatomy"),
    },
    {
      id: "ai_generator",
      title: "AI Workout Generator",
      subtitle: "Generate tailored plans with FitHub AI",
      icon: <AutoAwesomeIcon style={{ color: "#c084fc" }} />,
      shortcut: "A",
      authRequired: true,
      action: () => {
        if (user?.username) {
          navigate(`/${user.username}/myworkouts?ai=true`);
        } else {
          navigate("/workouts?ai=true");
        }
      },
    },
    {
      id: "warmup",
      title: "Pre-Workout Warmup & Stretches",
      subtitle: "Dynamic activation drills and injury prevention",
      icon: <WhatshotIcon style={{ color: "#ef4444" }} />,
      shortcut: "U",
      action: () => setIsWarmupModalOpen(true),
    },
    {
      id: "dashboard",
      title: "Training Dashboard",
      subtitle: "View your active stats, recovery & streak",
      icon: <DashboardIcon />,
      shortcut: "D",
      authRequired: true,
      action: () => navigate(user?.username ? `/${user.username}/dashboard` : "/profile/dashboard"),
    },
    {
      id: "explore_workouts",
      title: "Explore Workouts & Routines",
      subtitle: "Discover community, official & AI routines",
      icon: <StarIcon style={{ color: "#ffd700" }} />,
      shortcut: "W",
      action: () => navigate("/workouts?tab=explore"),
    },
    {
      id: "my_routines",
      title: "My Saved Routines",
      subtitle: "Manage and run your customized routines",
      icon: <BookmarkIcon style={{ color: "#00f0ff" }} />,
      shortcut: "M",
      authRequired: true,
      action: () => navigate(user?.username ? `/${user.username}/myworkouts` : "/workouts"),
    },
    {
      id: "exercises",
      title: "Exercise Library",
      subtitle: "1,300+ animated GIF guides and target muscle filters",
      icon: <FitnessCenterIcon />,
      shortcut: "E",
      action: () => navigate("/exercises/all"),
    },
    {
      id: "recipes",
      title: "Fitness Recipes & Nutrition",
      subtitle: "High-protein meal plans and macro breakdown",
      icon: <RestaurantIcon style={{ color: "#22c55e" }} />,
      shortcut: "R",
      action: () => navigate("/recipes"),
    },
    {
      id: "analytics",
      title: "Progress & PR Analytics",
      subtitle: "Track strength curves, body metrics & milestones",
      icon: <BarChartIcon style={{ color: "#00f0ff" }} />,
      shortcut: "P",
      authRequired: true,
      action: () => navigate(user?.username ? `/${user.username}/analytics` : "/profile/analytics"),
    },
    {
      id: "history",
      title: "Workout History & Logs",
      subtitle: "Review past completed training sessions",
      icon: <HistoryIcon />,
      shortcut: "H",
      authRequired: true,
      action: () => navigate(user?.username ? `/${user.username}/history` : "/profile/history"),
    },
    {
      id: "tools",
      title: "Fitness Tools (1RM, BMI, Macro)",
      subtitle: "Calculators for 1 Rep Max, target plates & BMI",
      icon: <CalculateIcon style={{ color: "#f59e0b" }} />,
      shortcut: "T",
      action: () => navigate(user?.username ? `/${user.username}/fitnesstools` : "/profile/fitnesstools"),
    },
    {
      id: "settings",
      title: "Settings & Unit Preferences",
      subtitle: "Switch between KG / LBS, CM / INCHES and theme",
      icon: <SettingsIcon />,
      shortcut: "S",
      authRequired: true,
      action: () => navigate(user?.username ? `/${user.username}/settings` : "/profile/settings"),
    },
    ...THEMES.map((theme) => ({
      id: `theme-${theme.id}`,
      title: `Theme: ${theme.name} ${theme.emoji}`,
      subtitle: `${theme.purpose} — ${theme.description}`,
      icon: (
        <span
          style={{
            display: "inline-block",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: theme.accent,
            boxShadow: `0 0 8px ${theme.accent}`,
          }}
        />
      ),
      action: () => {
        applyTheme(theme.id);
        toast.success(`Applied ${theme.name} theme!`);
      },
    })),
  ], [user?.username, navigate]);

  const filteredActions = useMemo(() => {
    return actions.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        (item.shortcut && item.shortcut.toLowerCase() === query.toLowerCase().trim())
    );
  }, [actions, query]);

  const handleSelectAction = useCallback((item) => {
    if (item.authRequired && !isLoggedIn) {
      setIsOpen(false);
      dispatch(portalActions.setPortalOpen());
      toast.info(`Please log in or sign up to access ${item.title}!`);
      return;
    }
    setIsOpen(false);
    setQuery("");
    item.action();
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in an input or textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setShowCheatsheet(false);
        return;
      }

      // Escape key closes modal
      if (e.key === "Escape") {
        if (isOpen || showCheatsheet) {
          e.preventDefault();
          setIsOpen(false);
          setShowCheatsheet(false);
        }
        return;
      }

      // If palette is open, handle arrow navigation
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
        } else if (e.key === "Enter" && filteredActions[selectedIndex]) {
          e.preventDefault();
          handleSelectAction(filteredActions[selectedIndex]);
        }
        return;
      }

      // Single-key shortcuts when NOT in an input field
      if (!isInput && e.key && typeof e.key === "string" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === "?") {
          e.preventDefault();
          setShowCheatsheet((prev) => !prev);
          return;
        }

        const keyUpper = e.key.toUpperCase();
        const matched = actions.find((a) => a.shortcut === keyUpper);
        if (matched) {
          e.preventDefault();
          handleSelectAction(matched);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showCheatsheet, filteredActions, selectedIndex, actions, handleSelectAction]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* ⚡ Floating Quick Access Hub Trigger Button (Mobile & Desktop) */}
      <button
        type="button"
        className="quick-hub-floating-btn"
        onClick={() => setIsOpen(true)}
        title="Quick Gym Hub (Cmd + K)"
      >
        <BoltIcon className="bolt-icon" />
        <span className="hub-label">Quick Hub</span>
        <span className="key-badge">⌘K</span>
      </button>

      {/* Global Plate Calculator Modal */}
      <PlateCalculatorModal
        open={isPlateModalOpen}
        onClose={() => setIsPlateModalOpen(false)}
        initialWeight={60}
        unit={user?.settings?.weightUnit || "kg"}
      />

      {/* Global Pre-Workout Warmup Modal */}
      <PreWorkoutWarmupModal
        open={isWarmupModalOpen}
        onClose={() => setIsWarmupModalOpen(false)}
        targetMuscleGroup="Full Body"
      />

      {/* 🔍 Quick Command Palette Modal */}
      {isOpen && (
        <div className="quick-palette-backdrop" onClick={() => setIsOpen(false)}>
          <div className="quick-palette-modal" onClick={(e) => e.stopPropagation()}>
            <div className="palette-input-row">
              <SearchIcon className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a feature name or single shortcut (e.g. L for Plate Calc, N for Anatomy, A for AI)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <button
                type="button"
                className="btn-close-palette"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </div>

            <div className="palette-results-list">
              {filteredActions.length === 0 ? (
                <div className="no-actions-found">No features found for "{query}"</div>
              ) : (
                filteredActions.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`palette-action-item ${idx === selectedIndex ? "selected" : ""}`}
                    onClick={() => handleSelectAction(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="action-left">
                      <div className="action-icon-wrap">{item.icon}</div>
                      <div className="action-text">
                        <span className="action-title">{item.title}</span>
                        <span className="action-subtitle">{item.subtitle}</span>
                      </div>
                    </div>
                    {item.shortcut && (
                      <span className="action-shortcut-pill">{item.shortcut}</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="palette-footer">
              <div className="footer-keys">
                <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                <span><kbd>↵</kbd> to select</span>
                <span><kbd>esc</kbd> to close</span>
                <span><kbd>?</kbd> for cheat-sheet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⌨️ Keyboard Shortcuts Cheat-Sheet Modal */}
      {showCheatsheet && (
        <div className="quick-palette-backdrop" onClick={() => setShowCheatsheet(false)}>
          <div className="cheatsheet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cheatsheet-header">
              <div className="header-title">
                <KeyboardIcon style={{ color: "#00f0ff" }} />
                <h3>Keyboard Shortcuts & Fast Access</h3>
              </div>
              <button
                type="button"
                className="btn-close-palette"
                onClick={() => setShowCheatsheet(false)}
              >
                <CloseIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </div>
            <div className="cheatsheet-grid">
              {actions.map((act) => (
                <div key={act.id} className="cheatsheet-item" onClick={() => handleSelectAction(act)}>
                  <span className="cheatsheet-key">{act.shortcut}</span>
                  <div className="cheatsheet-info">
                    <strong>{act.title}</strong>
                    <span>{act.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickCommandPalette;
