import React, { useState, useEffect, useRef } from "react";
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
import { portalActions } from "../store/index";
import { toast } from "react-toastify";

import "../styles/_quickCommandPalette.scss";

const QuickCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const actions = [
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
      id: "ai_generator",
      title: "AI Workout Generator",
      subtitle: "Generate tailored plans with Gemini AI",
      icon: <AutoAwesomeIcon style={{ color: "#a855f7" }} />,
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
  ];

  const filteredActions = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      (item.shortcut && item.shortcut.toLowerCase() === query.toLowerCase().trim())
  );

  const handleSelectAction = (item) => {
    if (item.authRequired && !isLoggedIn) {
      setIsOpen(false);
      dispatch(portalActions.setPortalOpen());
      toast.info(`Please log in or sign up to access ${item.title}!`);
      return;
    }
    setIsOpen(false);
    setQuery("");
    item.action();
  };

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
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showCheatsheet, selectedIndex, filteredActions, isLoggedIn, user]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen && !showCheatsheet) return null;

  return (
    <div
      className="command-palette-backdrop"
      onClick={() => {
        setIsOpen(false);
        setShowCheatsheet(false);
      }}
    >
      {showCheatsheet ? (
        <div className="cheatsheet-card" onClick={(e) => e.stopPropagation()}>
          <div className="palette-header">
            <div className="palette-header-title">
              <KeyboardIcon className="header-icon" />
              <span>Keyboard Shortcuts</span>
            </div>
            <button className="palette-close-btn" onClick={() => setShowCheatsheet(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="cheatsheet-grid">
            <div className="shortcut-row">
              <span className="shortcut-label">Quick Search & Palette</span>
              <kbd className="kbd-badge">⌘ K</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Explore Workouts & WOD</span>
              <kbd className="kbd-badge">W</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Exercise Library (1,300+)</span>
              <kbd className="kbd-badge">E</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Healthy Recipes</span>
              <kbd className="kbd-badge">R</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Training Dashboard</span>
              <kbd className="kbd-badge">D</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">My Saved Routines</span>
              <kbd className="kbd-badge">M</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">AI Workout Generator</span>
              <kbd className="kbd-badge">A</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Strength & PR Analytics</span>
              <kbd className="kbd-badge">P</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Workout Logs & History</span>
              <kbd className="kbd-badge">H</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Fitness Tools (1RM / BMI)</span>
              <kbd className="kbd-badge">T</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Settings & Units</span>
              <kbd className="kbd-badge">S</kbd>
            </div>
            <div className="shortcut-row">
              <span className="shortcut-label">Close Palette / Modal</span>
              <kbd className="kbd-badge">ESC</kbd>
            </div>
          </div>
        </div>
      ) : (
        <div className="command-palette-card" onClick={(e) => e.stopPropagation()}>
          <div className="palette-input-wrap">
            <SearchIcon className="palette-search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="palette-search-input"
              placeholder="Type a command, page name or press shortcut (e.g. 'W', 'Exercises')..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
            />
            <kbd className="palette-esc-badge">ESC</kbd>
          </div>

          <div className="palette-results-list">
            {filteredActions.length === 0 ? (
              <div className="palette-empty-state">
                <p>No matching commands found for "{query}"</p>
              </div>
            ) : (
              filteredActions.map((item, index) => (
                <div
                  key={item.id}
                  className={`palette-item ${index === selectedIndex ? "selected" : ""}`}
                  onClick={() => handleSelectAction(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="palette-item-icon">{item.icon}</div>
                  <div className="palette-item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-subtitle">{item.subtitle}</span>
                  </div>
                  {item.shortcut && <kbd className="palette-item-shortcut">{item.shortcut}</kbd>}
                </div>
              ))
            )}
          </div>

          <div className="palette-footer">
            <div className="footer-tip">
              <span>Navigate</span> <kbd>↑</kbd> <kbd>↓</kbd>
              <span style={{ marginLeft: "10px" }}>Select</span> <kbd>↵</kbd>
              <span style={{ marginLeft: "10px" }}>Shortcuts</span> <kbd>?</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCommandPalette;
