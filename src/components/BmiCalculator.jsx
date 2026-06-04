import React, { useState } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";

const BmiCalculator = () => {
  const unit = localStorage.getItem("fithub_unit_preference") || "metric";
  const isImperial = unit === "imperial";

  const [age, setAge] = useState(localStorage.getItem("fithub_bmi_age") || "");
  const [gender, setGender] = useState(localStorage.getItem("fithub_bmi_gender") || "male");
  const [height, setHeight] = useState(localStorage.getItem("fithub_bmi_height") || "");
  const [weight, setWeight] = useState(localStorage.getItem("fithub_bmi_weight") || "");
  const [bmi, setBmi] = useState("NA");
  const [bmiStatus, setBmiStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");

  const calculateBmi = () => {
    let hMetric = Number(height);
    let wMetric = Number(weight);

    if (isImperial) {
      hMetric = hMetric * 2.54;    // inches → cm
      wMetric = wMetric * 0.453592; // lbs → kg
    }

    if (!hMetric || !wMetric || hMetric <= 0 || wMetric <= 0) {
      alert("Please enter valid height and weight values.");
      return;
    }

    localStorage.setItem("fithub_bmi_age", age);
    localStorage.setItem("fithub_bmi_gender", gender);
    localStorage.setItem("fithub_bmi_height", height);
    localStorage.setItem("fithub_bmi_weight", weight);

    const bmiValue = (wMetric / ((hMetric / 100) * (hMetric / 100))).toFixed(1);
    setBmi(bmiValue);

    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) {
      setBmiStatus("Underweight");
      setStatusColor("#ffb300");
    } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
      setBmiStatus("Normal Weight");
      setStatusColor("#00e676");
    } else if (bmiNum >= 25 && bmiNum <= 29.9) {
      setBmiStatus("Overweight");
      setStatusColor("#ff9100");
    } else {
      setBmiStatus("Obese");
      setStatusColor("#ff1744");
    }
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
        <h3 className="bmi-title">
          <CalculateIcon className="header-icon" /> Body Mass Index Calculator
        </h3>
        <p className="bmi-subtitle">
          Quickly evaluate your body mass ratio.
          {isImperial && <span className="bmi-unit-badge"> · Imperial Mode (lbs / in)</span>}
        </p>
      </div>

      <div className="bmi-form-body">
        <div className="form-grid">
          <div className="form-group age-group">
            <label htmlFor="bmi-age">Age</label>
            <input
              type="number"
              id="bmi-age"
              placeholder="e.g. 24"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group gender-group">
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
            <label htmlFor="bmi-height">Height ({isImperial ? "in" : "cm"})</label>
            <input
              type="number"
              id="bmi-height"
              placeholder={isImperial ? "e.g. 69" : "e.g. 175"}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bmi-weight">Weight ({isImperial ? "lbs" : "kg"})</label>
            <input
              type="number"
              id="bmi-weight"
              placeholder={isImperial ? "e.g. 154" : "e.g. 70"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="bmi-result-row">
          <div className="result-display">
            <span className="result-label">Your BMI</span>
            <span className="result-value">{bmi}</span>
            {bmiStatus && (
              <span className="result-status" style={{ backgroundColor: statusColor }}>
                {bmiStatus}
              </span>
            )}
          </div>
          <button className="bmi-submit-btn" type="button" onClick={calculateBmi}>
            Calculate
          </button>
        </div>

        {bmi !== "NA" && (
          <div className="bmi-gauge-wrapper">
            <div className="bmi-gauge-track">
              <div className="bmi-gauge-segment underweight"></div>
              <div className="bmi-gauge-segment normal"></div>
              <div className="bmi-gauge-segment overweight"></div>
              <div className="bmi-gauge-segment obese"></div>
              <div
                className="bmi-gauge-pointer"
                style={{ left: `${getGaugePosition(bmi)}%`, backgroundColor: statusColor }}
              >
                <div className="pointer-tooltip" style={{ backgroundColor: statusColor }}>
                  {bmi}
                </div>
              </div>
            </div>
            <div className="bmi-gauge-labels">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (&ge;30)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BmiCalculator;
