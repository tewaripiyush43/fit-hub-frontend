import React, { useState } from "react";
import { useSelector } from "react-redux";
import { calculateMuscleRecovery } from "../utils/gymExperienceUtils";
import InteractiveMuscleMap from "./InteractiveMuscleMap";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import "../styles/_muscleRecovery.scss";

const MuscleRecoveryHeatmap = () => {
  const [viewMode, setViewMode] = useState("anatomy"); // 'anatomy' or 'cards'
  const [selectedMuscleId, setSelectedMuscleId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const sessionHistory = user?.sessionHistory || [];
  const recoveryData = calculateMuscleRecovery(sessionHistory);

  const fatiguedCount = recoveryData.filter((m) => m.status === "fatigued").length;
  const recoveringCount = recoveryData.filter((m) => m.status === "recovering").length;
  const readyCount = recoveryData.filter((m) => m.status === "ready").length;

  const handleSelectMuscle = (muscleId) => {
    setSelectedMuscleId(muscleId);
  };

  return (
    <div className="muscle-recovery-heatmap-widget">
      <div className="widget-header">
        <div className="header-title-left">
          <div className="widget-icon-wrap">
            <BatteryChargingFullIcon className="widget-icon" />
          </div>
          <div>
            <h3 className="widget-title">Muscle Recovery & Fatigue</h3>
            <p className="widget-subtitle">
              Dynamic biomechanical recovery based on your last 72 hours of training
            </p>
          </div>
        </div>

        <div className="widget-header-right-controls" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* View Mode Toggle Switch */}
          <div className="view-mode-toggle" style={{ display: "flex", background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "3px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={() => setViewMode("anatomy")}
              style={{
                background: viewMode === "anatomy" ? "rgba(0, 240, 255, 0.2)" : "transparent",
                color: viewMode === "anatomy" ? "#00f0ff" : "#9ca3af",
                border: viewMode === "anatomy" ? "1px solid rgba(0,240,255,0.4)" : "none",
                borderRadius: "6px",
                padding: "0.3rem 0.65rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <AccessibilityNewIcon style={{ fontSize: "0.95rem" }} /> 2D Anatomy
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              style={{
                background: viewMode === "cards" ? "rgba(0, 240, 255, 0.2)" : "transparent",
                color: viewMode === "cards" ? "#00f0ff" : "#9ca3af",
                border: viewMode === "cards" ? "1px solid rgba(0,240,255,0.4)" : "none",
                borderRadius: "6px",
                padding: "0.3rem 0.65rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <ViewModuleIcon style={{ fontSize: "0.95rem" }} /> Grid
            </button>
          </div>

          <div className="recovery-pills-summary">
            <span className="summary-pill ready" title="Ready to train">
              <CheckCircleIcon style={{ fontSize: "0.85rem" }} /> {readyCount} Ready
            </span>
            {recoveringCount > 0 && (
              <span className="summary-pill recovering" title="Recovering (24-48h)" style={{ background: "rgba(0, 240, 255, 0.1)", color: "#00f0ff", border: "1px solid rgba(0, 240, 255, 0.3)" }}>
                ⚡ {recoveringCount} Recovering
              </span>
            )}
            {fatiguedCount > 0 && (
              <span className="summary-pill fatigued" title="Trained in last 24h">
                <WhatshotIcon style={{ fontSize: "0.85rem" }} /> {fatiguedCount} Fatigued
              </span>
            )}
          </div>
        </div>
      </div>

      {viewMode === "anatomy" ? (
        <InteractiveMuscleMap
          selectedMuscleId={selectedMuscleId}
          mode="recovery"
          title="Anatomical Muscle Recovery Heatmap"
          subtitle="Color-coded recovery status based on resistance exercises logged in your workouts"
          onSelectMuscle={handleSelectMuscle}
        />
      ) : (
        <div className="muscle-grid">
          {recoveryData.map((muscle) => {
            return (
              <div key={muscle.id} className={`muscle-recovery-card ${muscle.status}`}>
                <div className="muscle-card-top">
                  <div className="muscle-name-group">
                    <span className="muscle-emoji">{muscle.emoji}</span>
                    <span className="muscle-name">{muscle.label}</span>
                  </div>
                  <span className={`status-badge ${muscle.status}`}>
                    {muscle.status === "fatigued" && "🔥 Fatigued"}
                    {muscle.status === "recovering" && "⚡ Recovering"}
                    {muscle.status === "ready" && "✅ Ready"}
                  </span>
                </div>

                <div className="recovery-meter-wrap">
                  <div className="recovery-meter-bar">
                    <div
                      className={`recovery-meter-fill ${muscle.status}`}
                      style={{ width: `${muscle.recoveryPercent}%` }}
                    />
                  </div>
                  <div className="recovery-meter-labels">
                    <span className="recovery-pct">{muscle.recoveryPercent}% Recovered</span>
                    <span className="time-ago">
                      {muscle.hoursAgo !== null ? `${muscle.hoursAgo}h ago` : "Fresh"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MuscleRecoveryHeatmap;
