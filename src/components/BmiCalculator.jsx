import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CalculateIcon from "@mui/icons-material/Calculate";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { toast } from "react-toastify";
import { useUnitPreference } from "../utils/useUnitPreference";
import { addBodyMetric, updateUserInfo } from "../api/userApi";
import { authActions } from "../store/index";

const BmiCalculator = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { isMetric, weightUnit, heightUnit } = useUnitPreference();
  const isImperial = !isMetric;

  const [age, setAge] = useState(() => user?.age || localStorage.getItem("fithub_bmi_age") || "");
  const [gender, setGender] = useState(() => user?.gender || localStorage.getItem("fithub_bmi_gender") || "male");
  const [height, setHeight] = useState(() => user?.height || localStorage.getItem("fithub_bmi_height") || (isMetric ? "178" : "70"));
  const [weight, setWeight] = useState(() => user?.weight || localStorage.getItem("fithub_bmi_weight") || (isMetric ? "75" : "165"));
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");

  useEffect(() => {
    if (user) {
      if (user.age && !age) setAge(user.age);
      if (user.gender && !gender) setGender(user.gender);
      if (user.height && !height) setHeight(user.height);
      if (user.weight && !weight) setWeight(user.weight);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncToBodyMetrics = async (bmiValue, wNum, hNum, statusLabel) => {
    const today = new Date().toISOString().split("T")[0];
    const timestamp = Date.now();
    const newEntry = {
      id: timestamp.toString(),
      date: today,
      timestamp,
      weight: Number(wNum),
      height: Number(hNum),
      bmi: Number(bmiValue),
      unit: isMetric ? "metric" : "imperial",
    };

    if (isLoggedIn) {
      try {
        await addBodyMetric(dispatch, {
          date: today,
          timestamp,
          weight: Number(wNum),
          height: Number(hNum),
          bmi: Number(bmiValue),
          unit: isMetric ? "metric" : "imperial",
        });
        if (age || gender) {
          await updateUserInfo(dispatch, {
            age: age ? Number(age) : undefined,
            gender: gender || undefined,
            height: Number(hNum),
            weight: Number(wNum),
          });
        }
      } catch (err) {
        console.error("Failed to sync BMI to DB:", err);
        dispatch(authActions.addBodyMetric(newEntry));
      }
    } else {
      dispatch(authActions.addBodyMetric(newEntry));
    }

    try {
      const STORAGE_KEY = "fithub_body_metrics_history";
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [...existing, newEntry].sort(
        (a, b) => (a.timestamp || new Date(a.date).getTime()) - (b.timestamp || new Date(b.date).getTime())
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("fithub_metrics_changed"));
    } catch (err) {
      console.error("Failed to sync body metrics to local storage:", err);
    }

    toast.success(`BMI ${bmiValue} (${statusLabel}) logged to your Body History!`);
  };

  const calculateBmi = () => {
    let hMetric = Number(height);
    let wMetric = Number(weight);

    if (isImperial) {
      hMetric = hMetric * 2.54;    // inches → cm
      wMetric = wMetric * 0.453592; // lbs → kg
    }

    if (!hMetric || !wMetric || hMetric <= 0 || wMetric <= 0) {
      toast.warn("Please enter valid height and weight values.");
      return;
    }

    localStorage.setItem("fithub_bmi_age", age);
    localStorage.setItem("fithub_bmi_gender", gender);
    localStorage.setItem("fithub_bmi_height", height);
    localStorage.setItem("fithub_bmi_weight", weight);

    const bmiValue = (wMetric / ((hMetric / 100) * (hMetric / 100))).toFixed(1);
    setBmi(bmiValue);

    const bmiNum = parseFloat(bmiValue);
    let status = "";
    let color = "";

    if (bmiNum < 18.5) {
      status = "Underweight";
      color = "#ffb300";
    } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
      status = "Normal Weight";
      color = "#00e676";
    } else if (bmiNum >= 25 && bmiNum <= 29.9) {
      status = "Overweight";
      color = "#ff9100";
    } else {
      status = "Obese";
      color = "#ff1744";
    }

    setBmiStatus(status);
    setStatusColor(color);

    // Auto sync to body metrics history & DB
    syncToBodyMetrics(bmiValue, weight, height, status);
  };

  const getGaugePosition = (bmiVal) => {
    const val = parseFloat(bmiVal);
    if (isNaN(val) || val <= 0) return 0;
    const minBmi = 15;
    const maxBmi = 35;
    const percentage = ((val - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  return (
    <div className="bmi-calculator-premium">
      <div className="bmi-header">
        <div className="header-icon-wrap">
          <CalculateIcon className="header-icon" />
        </div>
        <div className="header-texts">
          <h3 className="bmi-title">Body Mass Index (BMI) Calculator</h3>
          <p className="bmi-subtitle">
            Calculate your BMI and automatically log your body composition.
            <span className="bmi-unit-badge"> · {isMetric ? "Metric (kg / cm)" : "Imperial (lbs / in)"}</span>
          </p>
        </div>
      </div>

      <div className="bmi-form-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="bmi-age">Age (years)</label>
            <input
              type="number"
              id="bmi-age"
              placeholder="e.g. 24"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="gender-options">
              <label className="radio-container">
                <input
                  type="radio"
                  name="bmi-gender"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <span className="radio-label">Male</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="bmi-gender"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <span className="radio-label">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="bmi-height">Height ({heightUnit})</label>
            <input
              type="number"
              step="0.1"
              id="bmi-height"
              placeholder={`e.g. ${isMetric ? "178" : "70"}`}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bmi-weight">Weight ({weightUnit})</label>
            <input
              type="number"
              step="0.1"
              id="bmi-weight"
              placeholder={`e.g. ${isMetric ? "75" : "165"}`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <button className="bmi-submit-btn" onClick={calculateBmi}>
          <CalculateIcon fontSize="small" /> Calculate BMI & Log
        </button>
      </div>

      {bmi && (
        <div className="bmi-results-card fade-in">
          <div className="results-top-row">
            <div className="score-badge-block">
              <span className="score-label">Your BMI Score</span>
              <div className="score-val-wrap">
                <span className="bmi-number">{bmi}</span>
                <span className="bmi-status-pill" style={{ color: statusColor, borderColor: statusColor, background: `${statusColor}18` }}>
                  {bmiStatus}
                </span>
              </div>
            </div>

            <div className="synced-badge">
              <BookmarkAddedIcon style={{ fontSize: "1rem", color: "#00e676" }} />
              <span>Auto-logged to Metrics</span>
            </div>
          </div>

          {/* Graphical Gauge Track */}
          <div className="bmi-gauge-wrapper">
            <div className="gauge-track-bar">
              <div className="gauge-seg under" title="Underweight (&lt; 18.5)"></div>
              <div className="gauge-seg normal" title="Normal (18.5 - 24.9)"></div>
              <div className="gauge-seg over" title="Overweight (25 - 29.9)"></div>
              <div className="gauge-seg obese" title="Obese (&ge; 30)"></div>
              <div
                className="gauge-indicator-pin"
                style={{ left: `${getGaugePosition(bmi)}%` }}
              >
                <span className="pin-head" style={{ backgroundColor: statusColor }}></span>
              </div>
            </div>

            <div className="bmi-categories-legend">
              <div className="legend-item under">
                <span className="dot"></span>
                <span>&lt; 18.5 Under</span>
              </div>
              <div className="legend-item normal">
                <span className="dot"></span>
                <span>18.5–24.9 Normal</span>
              </div>
              <div className="legend-item over">
                <span className="dot"></span>
                <span>25–29.9 Over</span>
              </div>
              <div className="legend-item obese">
                <span className="dot"></span>
                <span>&ge; 30 Obese</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
