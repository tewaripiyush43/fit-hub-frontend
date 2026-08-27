import React, { useState } from "react";
import profilePicture from "../assets/images/home-img-7.webp";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalculateIcon from "@mui/icons-material/Calculate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { calculateAthleteTier, ATHLETE_TIERS } from "../utils/athleteTierUtils";
import { updateUserInfo } from "../api/userApi";

// UI Primitives
import { Button } from "./ui";

const PROFILE_BIO_MAX_LENGTH = 170;

const UserProfileInfoCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showTierModal, setShowTierModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editForm, setEditForm] = useState({
    fullname: "",
    bio: "",
    location: "",
    age: "",
    weight: "",
    height: "",
    playlistLink: "",
    yearsTraining: "",
    yearsAtGym: "",
    fitnessLevel: "",
  });

  const openEditMode = () => {
    setEditForm({
      fullname: user?.fullname || "",
      bio: user?.bio || "",
      location: user?.location || "",
      age: user?.age !== undefined && user?.age !== null ? user.age : "",
      weight: user?.weight !== undefined && user?.weight !== null ? user.weight : "",
      height: user?.height !== undefined && user?.height !== null ? user.height : "",
      playlistLink: user?.playlistLink || "",
      yearsTraining: user?.yearsTraining !== undefined && user?.yearsTraining !== null ? user.yearsTraining : "",
      yearsAtGym: user?.yearsAtGym !== undefined && user?.yearsAtGym !== null ? user.yearsAtGym : "",
      fitnessLevel: user?.fitnessLevel || "",
    });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...editForm,
        age: editForm.age === "" ? null : Number(editForm.age),
        height: editForm.height === "" ? null : Number(editForm.height),
        weight: editForm.weight === "" ? null : Number(editForm.weight),
        yearsTraining: editForm.yearsTraining === "" ? null : Number(editForm.yearsTraining),
        yearsAtGym: editForm.yearsAtGym === "" ? null : Number(editForm.yearsAtGym),
      };
      await updateUserInfo(dispatch, payload);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const bioText =
    user?.bio && user.bio !== "Your bio goes here. Edit your profile to add a bio. max 170 chars"
      ? user.bio
      : "No bio provided yet.";
  const locationText = user?.location ? user.location : "Not specified";
  const ageText =
    user?.age !== undefined && user?.age !== null && user?.age !== "" ? `${user.age} yrs` : "Not set";
  const nameText = user?.fullname || user?.username || "FitHub Member";
  const fitnessLevelDisplay = user?.fitnessLevel
    ? { beginner: "🌱 Beginner", intermediate: "⚡ Intermediate", advanced: "🔱 Advanced", elite: "👑 Elite" }[user.fitnessLevel] || user.fitnessLevel
    : user?.profile?.fitnessLevel || "Not set";
  const primaryGoal = user?.profile?.primaryGoal || user?.goals?.[0]?.goalType || "General Fitness";
  const unitLabel =
    user?.settings?.unitPreference === "imperial" ? { w: "lbs", h: "in" } : { w: "kg", h: "cm" };

  const { currentTier, nextTier, progressPercent, remainingWorkouts } = calculateAthleteTier(user);

  return (
    <>
      <div className="user-profile-hero-card">
        {/* Top Banner Accent */}
        <div className="hero-banner-glow" />

        {/* Main Profile Header */}
        <div className="profile-hero-header">
          <div
            className="profile-avatar-wrapper"
            onClick={() => setShowTierModal(true)}
            title="View Athlete Tier Details"
          >
            <img src={profilePicture} alt={nameText} className="profile-hero-avatar" loading="lazy" />
            <span className="profile-tier-badge" style={{ borderColor: currentTier.color }}>
              {currentTier.badge}
            </span>
          </div>

          <div className="profile-hero-identity">
            <div className="name-and-tier">
              <h1 className="profile-hero-name">{nameText}</h1>
              <button
                type="button"
                className="profile-tier-pill"
                style={{
                  color: currentTier.color,
                  borderColor: `${currentTier.color}55`,
                  background: `${currentTier.color}15`,
                }}
                onClick={() => setShowTierModal(true)}
                title="Click to view rank progression criteria"
              >
                <MilitaryTechIcon style={{ fontSize: "1rem" }} />
                <span>{currentTier.name}</span>
                <InfoOutlinedIcon style={{ fontSize: "0.85rem", opacity: 0.8 }} />
              </button>
            </div>

            <p className="profile-hero-handle">@{user?.username || "athlete"}</p>

            <div className="profile-meta-chips">
              <span className="meta-chip">
                <LocationOnIcon style={{ fontSize: "0.85rem" }} />
                {locationText}
              </span>
              <span className="meta-chip">
                <CalendarMonthIcon style={{ fontSize: "0.85rem" }} />
                Joined{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "2024"}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              iconStart={<EditIcon />}
              onClick={openEditMode}
              title="Edit Profile"
            >
              Edit Profile
            </Button>
          ) : (
            <button
              type="button"
              className="profile-edit-close-btn"
              onClick={() => setIsEditing(false)}
              title="Cancel editing"
              aria-label="Cancel editing"
            >
              <CloseIcon style={{ fontSize: "1.1rem" }} />
            </button>
          )}
        </div>

        {/* Tier Level Progress Bar */}
        <div className="profile-tier-progress-box" onClick={() => setShowTierModal(true)}>
          <div className="tier-progress-labels">
            <span className="tier-current">
              Rank: <strong style={{ color: currentTier.color }}>{currentTier.name}</strong>
            </span>
            {nextTier ? (
              <span className="tier-next">
                {remainingWorkouts} workout{remainingWorkouts !== 1 ? "s" : ""} to{" "}
                <strong>
                  {nextTier.name} {nextTier.badge}
                </strong>
              </span>
            ) : (
              <span className="tier-next max-rank">⭐ Maximum Athlete Rank Achieved!</span>
            )}
          </div>
          <div className="tier-progress-track">
            <div
              className="tier-progress-bar"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier?.color || currentTier.color})`,
              }}
            />
          </div>
        </div>

        {/* Bio or Inline Edit Panel */}
        {isEditing ? (
          <div className="profile-inline-edit-panel">
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label htmlFor="edit-fullname">Full Name</label>
                <input
                  id="edit-fullname"
                  type="text"
                  value={editForm.fullname}
                  onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-age">Age (yrs)</label>
                <input
                  id="edit-age"
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  placeholder="e.g. 25"
                  min="1"
                  max="120"
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-weight">Body Weight ({unitLabel.w})</label>
                <input
                  id="edit-weight"
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                  placeholder={user?.settings?.unitPreference === "imperial" ? "e.g. 175" : "e.g. 75"}
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-height">Height ({unitLabel.h})</label>
                <input
                  id="edit-height"
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                  placeholder={user?.settings?.unitPreference === "imperial" ? "e.g. 70" : "e.g. 178"}
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-location">Location</label>
                <input
                  id="edit-location"
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-playlist">Spotify Playlist</label>
                <input
                  id="edit-playlist"
                  type="text"
                  value={editForm.playlistLink}
                  onChange={(e) => setEditForm({ ...editForm, playlistLink: e.target.value })}
                  placeholder="Paste playlist URL"
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-fitness-level">Fitness Level</label>
                <select
                  id="edit-fitness-level"
                  value={editForm.fitnessLevel}
                  onChange={(e) => setEditForm({ ...editForm, fitnessLevel: e.target.value })}
                >
                  <option value="">— Select Level —</option>
                  <option value="beginner">🌱 Beginner (0–1 yr)</option>
                  <option value="intermediate">⚡ Intermediate (1–3 yrs)</option>
                  <option value="advanced">🔱 Advanced (3–5 yrs)</option>
                  <option value="elite">👑 Elite (5+ yrs)</option>
                </select>
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-years-training">Years Training</label>
                <input
                  id="edit-years-training"
                  type="number"
                  value={editForm.yearsTraining}
                  onChange={(e) => setEditForm({ ...editForm, yearsTraining: e.target.value })}
                  placeholder="e.g. 3"
                  min="0"
                  max="80"
                />
              </div>
              <div className="profile-edit-field">
                <label htmlFor="edit-years-gym">Years at Gym</label>
                <input
                  id="edit-years-gym"
                  type="number"
                  value={editForm.yearsAtGym}
                  onChange={(e) => setEditForm({ ...editForm, yearsAtGym: e.target.value })}
                  placeholder="e.g. 2"
                  min="0"
                  max="80"
                />
              </div>
            </div>

            <div className="profile-edit-field profile-edit-field--full">
              <label htmlFor="edit-bio">
                Bio{" "}
                <span className="bio-char-count">
                  {(editForm.bio || "").length} / {PROFILE_BIO_MAX_LENGTH}
                </span>
              </label>
              <textarea
                id="edit-bio"
                rows={3}
                maxLength={PROFILE_BIO_MAX_LENGTH}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about your fitness background and goals..."
              />
            </div>

            <div className="profile-edit-actions">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconStart={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Bio Section */}
            <div className="profile-hero-bio">
              <p>{bioText}</p>
            </div>

            {/* Physical & Training Attributes Matrix */}
            <div className="profile-attributes-grid">
              <div className="attribute-card">
                <span className="attr-label">Fitness Level</span>
                <span className="attr-value capitalize">
                  {fitnessLevelDisplay}
                </span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Primary Goal</span>
                <span className="attr-value capitalize">{primaryGoal}</span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Athlete Age</span>
                <span className="attr-value">{ageText}</span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Body Weight</span>
                <span className="attr-value">
                  {user?.weight ? `${user.weight} ${unitLabel.w}` : "Not set"}
                </span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Height</span>
                <span className="attr-value">
                  {user?.height ? `${user.height} ${unitLabel.h}` : "Not set"}
                </span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Years Training</span>
                <span className="attr-value">
                  {user?.yearsTraining !== undefined && user?.yearsTraining !== null && user?.yearsTraining !== "" ? `${user.yearsTraining} yr${user.yearsTraining !== 1 ? "s" : ""}` : "Not set"}
                </span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Years at Gym</span>
                <span className="attr-value">
                  {user?.yearsAtGym !== undefined && user?.yearsAtGym !== null && user?.yearsAtGym !== "" ? `${user.yearsAtGym} yr${user.yearsAtGym !== 1 ? "s" : ""}` : "Not set"}
                </span>
              </div>
              <div className="attribute-card">
                <span className="attr-label">Unit System</span>
                <span className="attr-value uppercase">
                  {user?.settings?.unitPreference === "imperial" ? "Imperial (lbs/in)" : "Metric (kg/cm)"}
                </span>
              </div>
            </div>

            {/* Spotify Playlist Link */}
            {user?.playlistLink && (
              <a
                href={user.playlistLink}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-spotify-pill"
              >
                <MusicNoteIcon style={{ fontSize: "1rem" }} />
                <span>Open Workout Playlist</span>
                <span className="spotify-pill-arrow">↗</span>
              </a>
            )}
          </>
        )}

        {/* Save success flash */}
        {saveSuccess && (
          <div className="profile-save-success-flash">
            <CheckCircleIcon style={{ fontSize: "1rem" }} />
            Profile updated successfully!
          </div>
        )}

        {/* 🚀 Quick Command Shortcuts Strip */}
        {!isEditing && (
          <div className="profile-quick-actions-strip">
            <button
              className="quick-action-pill ai-pill"
              onClick={() => navigate(`/${user?.username}/myworkouts?ai=true`)}
            >
              <AutoAwesomeIcon style={{ fontSize: "0.95rem" }} />
              <span>AI Workout Generator</span>
            </button>

            <button
              className="quick-action-pill anatomy-pill"
              onClick={() => navigate("/anatomy")}
            >
              <AccessibilityNewIcon style={{ fontSize: "0.95rem" }} />
              <span>2D Muscle Map</span>
            </button>

            <button
              className="quick-action-pill analytics-pill"
              onClick={() => navigate(`/${user?.username}/analytics`)}
            >
              <BarChartIcon style={{ fontSize: "0.95rem" }} />
              <span>PR &amp; Volume Analytics</span>
            </button>

            <button
              className="quick-action-pill tools-pill"
              onClick={() => navigate(`/${user?.username}/fitnesstools`)}
            >
              <CalculateIcon style={{ fontSize: "0.95rem" }} />
              <span>Barbell Plate Calc</span>
            </button>
          </div>
        )}
      </div>

      {/* 🛡️ Athlete Tier Progression Modal */}
      {showTierModal && (
        <div className="quick-palette-backdrop" onClick={() => setShowTierModal(false)}>
          <div className="tier-progression-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tier-modal-header">
              <div className="tier-modal-title">
                <MilitaryTechIcon style={{ color: "#ffd700", fontSize: "1.4rem" }} />
                <h3>Athlete Progression Tier System</h3>
              </div>
              <button
                type="button"
                className="tier-modal-close-btn"
                onClick={() => setShowTierModal(false)}
                title="Close"
              >
                <CloseIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </div>

            <p className="tier-modal-intro">
              Your FitHub Athlete Tier is unlocked dynamically through consistent training, workout
              volume milestones, and active streaks.
            </p>

            <div className="tier-cards-list">
              {ATHLETE_TIERS.map((tier) => {
                const isCurrent = tier.id === currentTier.id;
                const isUnlocked = tier.level <= currentTier.level;

                return (
                  <div
                    key={tier.id}
                    className={`tier-info-card ${isCurrent ? "current" : ""} ${isUnlocked ? "unlocked" : "locked"}`}
                    style={{ "--tier-color": tier.color }}
                  >
                    <div className="tier-card-left">
                      <span className="tier-card-badge">{tier.badge}</span>
                      <div>
                        <div className="tier-card-name-row">
                          <h4 style={{ color: tier.color }}>{tier.name}</h4>
                          {isCurrent && <span className="current-badge">Active Tier</span>}
                          {isUnlocked && !isCurrent && (
                            <CheckCircleIcon style={{ color: "#22c55e", fontSize: "1rem" }} />
                          )}
                        </div>
                        <p className="tier-card-criteria">{tier.criteria}</p>
                        <p className="tier-card-desc">{tier.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileInfoCard;
