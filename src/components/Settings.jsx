import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopUp.jsx";
import { updateUserInfo } from "../api/userApi";
import { deleteAccount } from "../api/authApi";
import { usePwa } from "../context/PwaContext";

import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GetAppIcon from "@mui/icons-material/GetApp";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { isInstallable, installApp, isAppInstalled } = usePwa();

  // Load preferences from localStorage or defaults
  const [unitSystem, setUnitSystem] = useState(
    localStorage.getItem("fithub_unit_preference") || "metric"
  );
  const [defaultPrivacy, setDefaultPrivacy] = useState(
    localStorage.getItem("fithub_default_privacy") || "private"
  );

  // Notifications state — track initial values to detect changes
  const [emailReminders, setEmailReminders] = useState(
    localStorage.getItem("fithub_notif_email") !== "false"
  );
  const [monthlyAchievements, setMonthlyAchievements] = useState(
    localStorage.getItem("fithub_notif_monthly") !== "false"
  );
  const [notifDirty, setNotifDirty] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  // User Profile edit states
  const [profileInfo, setProfileInfo] = useState({
    fullname: user?.fullname || "",
    bio: user?.bio || "",
    location: user?.location || "",
    age: user?.age !== undefined && user?.age !== null ? user?.age : "",
    playlistLink: user?.playlistLink || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Persist unit preference and broadcast storage event for other components
  useEffect(() => {
    localStorage.setItem("fithub_unit_preference", unitSystem);
    // Dispatch a custom event so other components (BMI calc) can react
    window.dispatchEvent(new Event("fithub_prefs_changed"));
  }, [unitSystem]);

  useEffect(() => {
    localStorage.setItem("fithub_default_privacy", defaultPrivacy);
  }, [defaultPrivacy]);

  useEffect(() => {
    if (user) {
      setProfileInfo({
        fullname: user?.fullname || "",
        bio: user?.bio || "",
        location: user?.location || "",
        age: user?.age !== undefined && user?.age !== null ? user?.age : "",
        playlistLink: user?.playlistLink || "",
      });
    }
  }, [user]);

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

  const handleNotifSave = () => {
    localStorage.setItem("fithub_notif_email", String(emailReminders));
    localStorage.setItem("fithub_notif_monthly", String(monthlyAchievements));
    setNotifDirty(false);
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserInfo(dispatch, profileInfo);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile settings:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const sendDeleteReq = async () => {
    try {
      await deleteAccount(dispatch);
      navigate(`/`);
    } catch (err) {
      console.error("Unable to delete account:", err);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "December 2023";

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
          <button className="floating-save-btn" onClick={handleNotifSave}>
            <SaveIcon style={{ fontSize: "1.1rem" }} /> Save Notifications
          </button>
        </div>
      )}

      {notifSaved && (
        <div className="settings-saved-toast">
          <CheckCircleOutlineIcon style={{ fontSize: "1.2rem" }} />
          Notification preferences saved!
        </div>
      )}

      <div className="settings-header">
        <h1 className="settings-title">
          <SettingsIcon className="settings-title-icon" /> Settings
        </h1>
        <p className="settings-subtitle">Manage your account preferences and safety settings.</p>
      </div>

      <div className="settings-content">
        {/* Section 1: Account Profile Details (Summary) */}
        <div className="settings-section">
          <h2 className="section-title">
            <PersonIcon className="section-icon" /> Account Details
          </h2>
          <div className="section-card">
            <div className="detail-row">
              <span className="detail-label">Username</span>
              <span className="detail-value">{user?.username || "testuser1"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user?.email || "user@example.com"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">{joinedDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Status</span>
              <span className="status-badge">Active Member</span>
            </div>
          </div>
        </div>

        {/* Section 2: Edit Profile Details Form */}
        <div className="settings-section">
          <h2 className="section-title">
            <PersonIcon className="section-icon" /> Edit Profile Details
          </h2>
          <form className="section-card" onSubmit={handleProfileSave}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="settings-fullname">Full Name</label>
                <input
                  type="text"
                  id="settings-fullname"
                  value={profileInfo.fullname}
                  onChange={(e) => setProfileInfo({ ...profileInfo, fullname: e.target.value })}
                  placeholder="e.g. Fit Hub"
                />
              </div>
              <div className="form-group">
                <label htmlFor="settings-age">Age</label>
                <input
                  type="number"
                  id="settings-age"
                  value={profileInfo.age}
                  onChange={(e) => setProfileInfo({ ...profileInfo, age: e.target.value })}
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="settings-location">Location</label>
                <input
                  type="text"
                  id="settings-location"
                  value={profileInfo.location}
                  onChange={(e) => setProfileInfo({ ...profileInfo, location: e.target.value })}
                  placeholder="e.g. Earth"
                />
              </div>
              <div className="form-group">
                <label htmlFor="settings-playlist">Spotify Playlist Link</label>
                <input
                  type="text"
                  id="settings-playlist"
                  value={profileInfo.playlistLink}
                  onChange={(e) => setProfileInfo({ ...profileInfo, playlistLink: e.target.value })}
                  placeholder="Paste playlist URL"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings-bio">Bio</label>
              <textarea
                id="settings-bio"
                rows={3}
                value={profileInfo.bio}
                onChange={(e) => setProfileInfo({ ...profileInfo, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px" }}>
              {saveSuccess && (
                <span style={{ color: "#00e676", fontWeight: "600", fontSize: "0.95rem" }}>
                  ✓ Profile updated!
                </span>
              )}
              <button
                type="submit"
                className="bmi-submit-btn"
                disabled={isSavingProfile}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Preferences */}
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
                  onClick={() => setDefaultPrivacy("private")}
                >
                  Private
                </button>
                <button
                  className={`toggle-btn ${defaultPrivacy === "public" ? "active" : ""}`}
                  onClick={() => setDefaultPrivacy("public")}
                >
                  Public
                </button>
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
                  <span className="pwa-installed-badge">
                    <CheckCircleOutlineIcon style={{ fontSize: "1.1rem" }} /> Installed
                  </span>
                ) : isInstallable ? (
                  <button 
                    type="button" 
                    className="bmi-submit-btn pwa-install-settings-btn"
                    onClick={installApp}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <GetAppIcon style={{ fontSize: "1.1rem" }} /> Install FitHub
                  </button>
                ) : (
                  <span className="pwa-guide-text">
                    Tap your browser's menu (or <span style={{ color: "#00f0ff" }}>Share</span> on iOS Safari) and select <span style={{ color: "#00f0ff" }}>'Add to Home Screen'</span>.
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
              <button onClick={() => setShowConfirmation(true)} className="btn-delete-account">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
