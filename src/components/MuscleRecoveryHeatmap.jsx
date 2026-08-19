import React from "react";
import { useSelector } from "react-redux";
import { calculateMuscleRecovery } from "../utils/gymExperienceUtils";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "../styles/_muscleRecovery.scss";

const MuscleRecoveryHeatmap = () => {
  const user = useSelector((state) => state.auth.user);
  const sessionHistory = user?.sessionHistory || [];
  const recoveryData = calculateMuscleRecovery(sessionHistory);

  const fatiguedCount = recoveryData.filter((m) => m.status === "fatigued").length;
  const recoveringCount = recoveryData.filter((m) => m.status === "recovering").length;
  const readyCount = recoveryData.filter((m) => m.status === "ready").length;

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
              Based on your last 72 hours of resistance training
            </p>
          </div>
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
    </div>
  );
};

export default MuscleRecoveryHeatmap;
