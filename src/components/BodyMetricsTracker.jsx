import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeightIcon from "@mui/icons-material/Height";
import SpeedIcon from "@mui/icons-material/Speed";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "../helpers/errorPopUp";
import { useUnitPreference } from "../utils/useUnitPreference";
import { addBodyMetric, deleteBodyMetric } from "../api/userApi";
import { authActions } from "../store/index";

const getStorageKey = (userId) => (userId ? `fithub_body_metrics_${userId}` : "fithub_body_metrics_guest");

const BodyMetricsTracker = ({ mode = "full" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { isMetric, weightUnit, heightUnit } = useUnitPreference();

  const storageKey = getStorageKey(user?._id);

  // Primary source of metrics is Redux user.bodyMetrics if present
  const reduxMetrics = user?.bodyMetrics;

  const [localLogs, setLocalLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse body metrics:", e);
    }
    return [];
  });

  const logs = useMemo(() => {
    if (reduxMetrics && Array.isArray(reduxMetrics)) {
      return reduxMetrics.map((m) => ({
        ...m,
        id: m._id || m.id || m.timestamp?.toString() || m.date,
      }));
    }
    return localLogs;
  }, [reduxMetrics, localLogs]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputHeight, setInputHeight] = useState(user?.height || "");
  const [inputDate, setInputDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [visibleCount, setVisibleCount] = useState(8);

  // Keep user-scoped local storage in sync as offline backup
  useEffect(() => {
    if (!storageKey) return;
    try {
      if (logs && logs.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(logs));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.error("Failed to save metrics to localStorage:", e);
    }
  }, [logs, storageKey]);

  const reloadMetrics = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setLocalLogs(JSON.parse(saved));
      else setLocalLogs([]);
    } catch (e) {
      console.error(e);
    }
  }, [storageKey]);

  useEffect(() => {
    window.addEventListener("fithub_metrics_changed", reloadMetrics);
    return () => window.removeEventListener("fithub_metrics_changed", reloadMetrics);
  }, [reloadMetrics]);

  const latestLog = logs[logs.length - 1] || null;
  const firstLog = logs[0] || null;

  const calculateBmi = useCallback((w, h) => {
    let weightKg = Number(w);
    let heightCm = Number(h);
    if (!isMetric) {
      weightKg = weightKg * 0.453592;
      heightCm = heightCm * 2.54;
    }
    if (!weightKg || !heightCm || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }, [isMetric]);

  const getBmiCategory = (bmi) => {
    const num = Number(bmi);
    if (!num || num <= 0 || isNaN(num)) return { label: "N/A", color: "#888" };
    if (num < 18.5) return { label: "Underweight", color: "#ffb300" };
    if (num <= 24.9) return { label: "Normal Weight", color: "#00e676" };
    if (num <= 29.9) return { label: "Overweight", color: "#ff9100" };
    return { label: "Obese", color: "#ff1744" };
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    const w = Number(inputWeight);
    const h = Number(inputHeight);
    if (!w || !h || w <= 0 || h <= 0) {
      toast.warn("Please enter valid positive numbers for weight and height.");
      return;
    }

    const calculatedBmi = calculateBmi(w, h);
    const dateStr = inputDate || new Date().toISOString().split("T")[0];
    const timestamp = Date.now();

    const newEntry = {
      id: timestamp.toString(),
      date: dateStr,
      timestamp,
      weight: w,
      height: h,
      bmi: calculatedBmi,
      unit: isMetric ? "metric" : "imperial",
    };

    if (isLoggedIn) {
      try {
        await addBodyMetric(dispatch, {
          date: dateStr,
          timestamp,
          weight: w,
          height: h,
          bmi: calculatedBmi,
          unit: isMetric ? "metric" : "imperial",
        });
      } catch (err) {
        console.error("Failed to save body metric to DB:", err);
        // Fallback to local Redux update
        dispatch(authActions.addBodyMetric(newEntry));
      }
    } else {
      const updated = [...localLogs, newEntry].sort(
        (a, b) => (a.timestamp || new Date(a.date).getTime()) - (b.timestamp || new Date(b.date).getTime())
      );
      setLocalLogs(updated);
      dispatch(authActions.addBodyMetric(newEntry));
    }

    localStorage.setItem("fithub_bmi_height", String(h));
    localStorage.setItem("fithub_bmi_weight", String(w));
    window.dispatchEvent(new Event("fithub_metrics_changed"));

    setInputWeight("");
    setShowLogModal(false);
    toast.success(`Logged check-in: ${w} ${weightUnit}`);
  };

  const handleDeleteLog = async (id) => {
    if (logs.length <= 1) {
      toast.warn("Keep at least one metric entry in your history");
      return;
    }

    if (isLoggedIn && id && id !== "1" && id !== "2" && id !== "3") {
      try {
        await deleteBodyMetric(dispatch, id);
        toast.success("Metric entry removed");
        return;
      } catch (err) {
        console.error("Failed to delete metric from DB:", err);
      }
    }

    setLocalLogs((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    dispatch(authActions.deleteBodyMetric(id));
    toast.success("Metric entry removed");
  };

  const totalWeightChange =
    latestLog && firstLog && logs.length > 1
      ? (latestLog.weight - firstLog.weight).toFixed(1)
      : null;

  // Always prefer stored entry.bmi to prevent false unit recalculation
  const currentBmi = latestLog ? (Number(latestLog.bmi) || calculateBmi(latestLog.weight, latestLog.height)) : 0;
  const bmiCategory = getBmiCategory(currentBmi);

  const reversedLogs = [...logs].reverse();
  const displayedLogs = reversedLogs.slice(0, visibleCount);

  return (
    <div className={`body-metrics-widget ${mode === "compact" ? "compact-mode" : "full-mode"}`} id="body-metrics">
      <div className="metrics-widget-header">
        <div className="metrics-header-left">
          <MonitorWeightIcon className="metrics-title-icon" />
          <div>
            <h3 className="metrics-title">
              {mode === "compact" ? "Today's Body Composition" : "Body Composition & Weight History"}
            </h3>
            <p className="metrics-subtitle">
              {mode === "compact" ? "Quick weigh-in & BMI summary" : "Track long-term bodyweight, BMI, and composition trends"}
            </p>
          </div>
        </div>

        <div className="metrics-header-actions">
          <button
            className="log-weight-btn"
            onClick={() => setShowLogModal(true)}
            title="Log today's body check-in"
          >
            <AddIcon fontSize="small" /> Log Weight
          </button>

          {mode === "compact" && (
            <button
              className="view-full-history-btn"
              onClick={() => navigate(`/${user?.username || "profile"}/analytics`)}
              title="View full historical charts and logs in Analytics"
            >
              Full History <ArrowForwardIcon style={{ fontSize: "0.85rem" }} />
            </button>
          )}
        </div>
      </div>

      {/* Hero Body Stats Row */}
      <div className="metrics-stats-grid">
        <div className="metrics-stat-card">
          <div className="stat-card-icon weight">
            <MonitorWeightIcon />
          </div>
          <div className="stat-card-body">
            <span className="stat-card-lbl">Current Weight</span>
            <span className="stat-card-val">
              {latestLog ? latestLog.weight : "--"}{" "}
              <span className="unit">{weightUnit}</span>
            </span>
          </div>
        </div>

        <div className="metrics-stat-card">
          <div className="stat-card-icon height">
            <HeightIcon />
          </div>
          <div className="stat-card-body">
            <span className="stat-card-lbl">Height</span>
            <span className="stat-card-val">
              {latestLog ? latestLog.height : "--"}{" "}
              <span className="unit">{heightUnit}</span>
            </span>
          </div>
        </div>

        <div className="metrics-stat-card">
          <div className="stat-card-icon bmi">
            <SpeedIcon />
          </div>
          <div className="stat-card-body">
            <span className="stat-card-lbl">BMI Ratio</span>
            <span className="stat-card-val" style={{ color: bmiCategory.color }}>
              {currentBmi > 0 ? currentBmi : "--"}
            </span>
            <span className="bmi-tag" style={{ color: bmiCategory.color }}>
              {bmiCategory.label}
            </span>
          </div>
        </div>

        <div className="metrics-stat-card">
          <div className="stat-card-icon change">
            {totalWeightChange && Number(totalWeightChange) < 0 ? (
              <TrendingDownIcon style={{ color: "#00e676" }} />
            ) : totalWeightChange && Number(totalWeightChange) > 0 ? (
              <TrendingUpIcon style={{ color: "#00b3e6" }} />
            ) : (
              <TrendingFlatIcon style={{ color: "#aaa" }} />
            )}
          </div>
          <div className="stat-card-body">
            <span className="stat-card-lbl">Overall Change</span>
            <span className="stat-card-val">
              {totalWeightChange !== null ? (
                <>
                  {Number(totalWeightChange) > 0 ? `+${totalWeightChange}` : totalWeightChange}{" "}
                  <span className="unit">{weightUnit}</span>
                </>
              ) : (
                "Baseline"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* History Log Shelf - Rendered only in Full Mode (Analytics Page) */}
      {mode === "full" && (
        <div className="metrics-history-shelf">
          <div className="shelf-top-row">
            <h4 className="shelf-heading">Check-in Timeline ({logs.length} entries)</h4>
          </div>
          {logs.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="metrics-table-wrapper desktop-only">
                <table className="metrics-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight ({weightUnit})</th>
                  <th>Height ({heightUnit})</th>
                  <th>BMI</th>
                  <th>Status</th>
                  <th className="align-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.map((entry) => {
                  const bVal = entry.bmi ? Number(entry.bmi) : calculateBmi(entry.weight, entry.height);
                  const bCat = getBmiCategory(bVal);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <span className="log-date">{entry.date}</span>
                      </td>
                      <td>
                        <span className="log-weight">
                          {entry.weight} {weightUnit}
                        </span>
                      </td>
                      <td>
                        <span className="log-height">
                          {entry.height} {heightUnit}
                        </span>
                      </td>
                      <td>
                        <span className="log-bmi">{bVal}</span>
                      </td>
                      <td>
                        <span
                          className="log-status-pill"
                          style={{ color: bCat.color, borderColor: bCat.color }}
                        >
                          {bCat.label}
                        </span>
                      </td>
                      <td className="align-right">
                        <button
                          className="delete-log-btn"
                          onClick={() => handleDeleteLog(entry.id)}
                          title="Delete log"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="metrics-mobile-cards-list mobile-only">
            {displayedLogs.map((entry) => {
              const bVal = entry.bmi ? Number(entry.bmi) : calculateBmi(entry.weight, entry.height);
              const bCat = getBmiCategory(bVal);
              return (
                <div className="mobile-metric-card" key={entry.id}>
                  <div className="card-top">
                    <span className="card-date">{entry.date}</span>
                    <span
                      className="card-status-pill"
                      style={{ color: bCat.color, borderColor: bCat.color }}
                    >
                      {bCat.label}
                    </span>
                  </div>
                  <div className="card-body-row">
                    <div className="metric-chip">
                      <span className="chip-lbl">Weight</span>
                      <span className="chip-val">{entry.weight} {weightUnit}</span>
                    </div>
                    <div className="metric-chip">
                      <span className="chip-lbl">Height</span>
                      <span className="chip-val">{entry.height} {heightUnit}</span>
                    </div>
                    <div className="metric-chip">
                      <span className="chip-lbl">BMI</span>
                      <span className="chip-val" style={{ color: bCat.color }}>{bVal}</span>
                    </div>
                    <button
                      className="mobile-del-btn"
                      onClick={() => handleDeleteLog(entry.id)}
                      title="Delete entry"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scalable "Show More" Button */}
          {reversedLogs.length > visibleCount && (
            <button
              className="metrics-show-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 10)}
            >
              Show More Check-ins ({reversedLogs.length - visibleCount} remaining)
            </button>
          )}
            </>
          ) : (
            <div className="analytics-empty">
              <p>No body metric check-ins recorded yet. Tap "+ Log Check-in" above to log your first weight and track your progress!</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Check-in Modal */}
      {showLogModal && (
        <div
          className="metrics-modal-overlay"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="metrics-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <MonitorWeightIcon className="modal-icon" />
              <h3>Log Body Check-in</h3>
              <p>Record your weight and height to track your fitness progression:</p>
            </div>

            <form onSubmit={handleAddLog} className="metrics-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight ({weightUnit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${isMetric ? "75.5" : "165"}`}
                    value={inputWeight}
                    onChange={(e) => setInputWeight(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Height ({heightUnit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${isMetric ? "178" : "70"}`}
                    value={inputHeight}
                    onChange={(e) => setInputHeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowLogModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Save Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMetricsTracker;
