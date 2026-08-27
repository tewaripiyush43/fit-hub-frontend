import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopUp.jsx";
import { updateUserSettings } from "../api/userApi";
import { deleteAccount } from "../api/authApi";
import { usePwa } from "../context/PwaContext";
import { useUnitPreference } from "../utils/useUnitPreference";
import { useTheme } from "../hooks/useTheme";
import { authActions } from "../store/index";

import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GetAppIcon from "@mui/icons-material/GetApp";

// UI Primitives
import { Badge, Button } from "./ui";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { isInstallable, installApp, isAppInstalled } = usePwa();
  const { unitSystem, setUnitSystem } = useUnitPreference();
  const { currentTheme, setTheme, themes } = useTheme();

  const [defaultPrivacy, setDefaultPrivacy] = useState(
    () => user?.settings?.defaultWorkoutPrivacy || localStorage.getItem("fithub_default_privacy") || "private"
  );

  // Notifications state
  const [emailReminders, setEmailReminders] = useState(
    () => (user?.settings?.emailReminders !== undefined ? user.settings.emailReminders : localStorage.getItem("fithub_notif_email") !== "false")
  );
  const [monthlyAchievements, setMonthlyAchievements] = useState(
    () => (user?.settings?.monthlyAchievements !== undefined ? user.settings.monthlyAchievements : localStorage.getItem("fithub_notif_monthly") !== "false")
  );
  const [notifDirty, setNotifDirty] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      if (user.settings.defaultWorkoutPrivacy) {
        setDefaultPrivacy(user.settings.defaultWorkoutPrivacy);
      }
      if (user.settings.emailReminders !== undefined) {
        setEmailReminders(user.settings.emailReminders);
      }
      if (user.settings.monthlyAchievements !== undefined) {
        setMonthlyAchievements(user.settings.monthlyAchievements);
      }
    }
  }, [user?.settings]);

  const handleDefaultPrivacyChange = async (val) => {
    setDefaultPrivacy(val);
    localStorage.setItem("fithub_default_privacy", val);
    dispatch(authActions.updateSettings({ defaultWorkoutPrivacy: val }));
    if (isLoggedIn) {
      try {
        await updateUserSettings(dispatch, { defaultWorkoutPrivacy: val });
      } catch (err) {
        console.error("Failed to save default privacy to DB:", err);
      }
    }
  };

  const handleEmailRemindersChange = (val) => {
    setEmailReminders(val);
    setNotifDirty(true);
    setNotifSaved(false);
  };

  const handleMonthlyAchievementsChange = (val) => {
    setMonthlyAchievements(val);
    setNotifDirty(true);
    setNotifSaved(false);
  };

  const handleNotifSave = async () => {
    localStorage.setItem("fithub_notif_email", String(emailReminders));
    localStorage.setItem("fithub_notif_monthly", String(monthlyAchievements));
    dispatch(authActions.updateSettings({ emailReminders, monthlyAchievements }));

    if (isLoggedIn) {
      try {
        await updateUserSettings(dispatch, { emailReminders, monthlyAchievements });
      } catch (err) {
        console.error("Failed to save notifications to DB:", err);
      }
    }

    setNotifDirty(false);
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };



  const sendDeleteReq = async () => {
    try {
      await deleteAccount(dispatch);
      navigate(`/`);
    } catch (err) {
      console.error("Unable to delete account:", err);
    }
  };

  return (
    <div className="settings-page-container">
      {showConfirmation && (
        <ConfirmationPopup
          onClose={() => setShowConfirmation(false)}
          textContent="account"
          onDelete={() => {
            sendDeleteReq();
            setShowConfirmation(false);
          }}
        />
      )}

      {/* Floating notification save bar */}
      {notifDirty && (
        <div className="settings-floating-save-bar">
          <span className="floating-save-message">You have unsaved notification changes</span>
          <Button variant="primary" size="sm" iconStart={<SaveIcon />} onClick={handleNotifSave}>
            Save Notifications
          </Button>
        </div>
      )}

      {notifSaved && (
        <div className="settings-saved-toast">
          <CheckCircleOutlineIcon style={{ fontSize: "1.2rem" }} />
          Notification preferences saved!
        </div>
      )}

      <div className="settings-header">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <Badge variant="accent" size="md">
            <SettingsIcon style={{ fontSize: "0.95rem", marginRight: "4px" }} />
            Account & Security Control
          </Badge>
        </div>
        <h1 className="settings-title">Account <span>Settings</span></h1>
        <p className="settings-subtitle">Manage your account preferences, biometrics, and security settings.</p>
      </div>

      <div className="settings-content">

        <div className="settings-section">
          <h2 className="section-title">
            <TuneIcon className="section-icon" /> Preferences
          </h2>
          <div className="section-card">
            <div className="setting-control-row">
              <div className="control-text">
                <span className="control-label">Unit System</span>
                <span className="control-description">
                  Affects weight and height inputs across the whole app (BMI, Macros, AI Workout).
                </span>
              </div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${unitSystem === "metric" ? "active" : ""}`}
                  onClick={() => setUnitSystem("metric")}
                >
                  Metric (kg/cm)
                </button>
                <button
                  className={`toggle-btn ${unitSystem === "imperial" ? "active" : ""}`}
                  onClick={() => setUnitSystem("imperial")}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>

            <div className="setting-control-row">
              <div className="control-text">
                <span className="control-label">Default Workout Privacy</span>
                <span className="control-description">Choose who can see your workouts by default.</span>
              </div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${defaultPrivacy === "private" ? "active" : ""}`}
                  onClick={() => handleDefaultPrivacyChange("private")}
                >
                  Private
                </button>
                <button
                  className={`toggle-btn ${defaultPrivacy === "public" ? "active" : ""}`}
                  onClick={() => handleDefaultPrivacyChange("public")}
                >
                  Public
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Fitness Themes & Visual Atmosphere */}
        <div className="settings-section">
          <h2 className="section-title">
            <PaletteIcon className="section-icon" /> Gym Theme & Visual Atmosphere
          </h2>
          <div className="section-card">
            <div className="theme-selector-container">
              <div className="control-text" style={{ maxWidth: "100%" }}>
                <span className="control-label">Performance Color Palette</span>
                <span className="control-description">
                  Select a tailored visual atmosphere engineered for your gym intensity, hypertrophy focus, and aesthetic vibe.
                </span>
              </div>

              <div className="theme-options-grid">
                {themes.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`theme-card-item ${isActive ? "active" : ""}`}
                      onClick={() => setTheme(theme.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${theme.name} theme`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setTheme(theme.id);
                        }
                      }}
                    >
                      <div className="theme-card-top-row">
                        <div className="theme-card-header">
                          <span className="theme-emoji">{theme.emoji}</span>
                          <h4 className="theme-name">{theme.name}</h4>
                        </div>
                        <Badge variant={isActive ? "accent" : "neutral"} size="sm">
                          {theme.badge}
                        </Badge>
                      </div>

                      <div className="theme-preview-palette">
                        <span
                          className="color-swatch accent"
                          style={{ backgroundColor: theme.accent, color: theme.accent }}
                        />
                        <span
                          className="color-swatch bg"
                          style={{ backgroundColor: theme.bgSurface }}
                        />
                        <span className="swatch-label">{theme.purpose}</span>
                      </div>

                      <p className="theme-description">{theme.description}</p>

                      {isActive ? (
                        <div className="theme-active-indicator">
                          <CheckCircleIcon style={{ fontSize: "1.1rem" }} />
                          <span>Active Theme</span>
                        </div>
                      ) : (
                        <div className="theme-active-indicator" style={{ opacity: 0.45 }}>
                          <span>Click to Apply</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3.5: Progressive Web App */}
        <div className="settings-section">
          <h2 className="section-title">
            <GetAppIcon className="section-icon" /> Progressive Web App
          </h2>
          <div className="section-card">
            <div className="setting-control-row pwa-settings-row">
              <div className="control-text">
                <span className="control-label">FitHub App Status</span>
                <span className="control-description">
                  {isAppInstalled 
                    ? "FitHub is installed as a standalone app on your home screen or desktop." 
                    : "Install the FitHub App on this device for quick offline tracking, faster performance, and a full-screen experience."}
                </span>
              </div>
              <div className="pwa-status-action">
                {isAppInstalled ? (
                  <Badge variant="success" size="md">
                    <CheckCircleOutlineIcon style={{ fontSize: "1rem", marginRight: "4px" }} /> Installed
                  </Badge>
                ) : isInstallable ? (
                  <Button 
                    variant="accent"
                    size="md"
                    iconStart={<GetAppIcon />}
                    onClick={installApp}
                  >
                    Install FitHub
                  </Button>
                ) : (
                  <span className="pwa-guide-text">
                    Tap your browser's menu (or <span style={{ color: "var(--accent)" }}>Share</span> on iOS Safari) and select <span style={{ color: "var(--accent)" }}>'Add to Home Screen'</span>.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Notifications */}
        <div className="settings-section">
          <h2 className="section-title">
            <NotificationsIcon className="section-icon" /> Notifications
          </h2>
          <div className="section-card">
            <div className="checkbox-control-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailReminders}
                  onChange={(e) => handleEmailRemindersChange(e.target.checked)}
                />
                <div className="checkbox-text">
                  <span className="control-label">Email Workout Reminders</span>
                  <span className="control-description">Receive reminder emails to keep up with your active workouts.</span>
                </div>
              </label>
            </div>

            <div className="checkbox-control-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={monthlyAchievements}
                  onChange={(e) => handleMonthlyAchievementsChange(e.target.checked)}
                />
                <div className="checkbox-text">
                  <span className="control-label">Monthly Progress Updates</span>
                  <span className="control-description">Get updates summarizing your personal records and achievements.</span>
                </div>
              </label>
            </div>

            <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(0, 240, 255, 0.05)", border: "1px solid rgba(0, 240, 255, 0.15)", borderRadius: "8px", fontSize: "0.85rem", color: "#8ab4f8" }}>
              ℹ️ Note: Automated email notification delivery is currently in development. Your selected preferences are saved and will automatically apply as delivery channels are deployed.
            </div>
          </div>
        </div>

        {/* Section 5: Safety & Danger Zone */}
        <div className="settings-section">
          <h2 className="section-title">
            <SecurityIcon className="section-icon" /> Safety & Danger Zone
          </h2>
          <div className="section-card danger-zone">
            <div className="danger-row">
              <div className="danger-text">
                <span className="danger-label">Delete Your Account</span>
                <span className="danger-description">
                  Permanently delete your profile, workouts, and achievements. This action is irreversible.
                </span>
              </div>
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowConfirmation(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
