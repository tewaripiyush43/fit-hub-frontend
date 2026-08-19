import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BmiCalculator from "./BmiCalculator";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { toast } from "react-toastify";
import { useUnitPreference } from "../utils/useUnitPreference";
import { updatePRs } from "../api/userApi";

import {
  calculatePlates,
  PLATE_COLORS_KG,
  PLATE_COLORS_LBS,
} from "../utils/gymExperienceUtils";
import "../styles/_gymModals.scss";

const POPULAR_1RM_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Incline Dumbbell Press",
  "Leg Press",
  "Pull-ups",
];

const FitnessTools = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("bmi");
  const { isMetric, weightUnit, heightUnit } = useUnitPreference();

  // Calorie & Macro State
  const [calAge, setCalAge] = useState(() => user?.age || "");
  const [calGender, setCalGender] = useState(() => user?.gender || "male");
  const [calHeight, setCalHeight] = useState(() => user?.height || "");
  const [calWeight, setCalWeight] = useState(() => user?.weight || "");
  const [calActivity, setCalActivity] = useState("1.375"); // Lightly active default
  const [calGoal, setCalGoal] = useState("maintain");
  const [macroResults, setMacroResults] = useState(null);

  // 1-Rep Max State
  const [rmExercise, setRmExercise] = useState("Bench Press");
  const [rmWeight, setRmWeight] = useState("");
  const [rmReps, setRmReps] = useState("5");
  const [rmResults, setRmResults] = useState(null);
  const [isSavingPR, setIsSavingPR] = useState(false);

  // Plate Calculator State
  const [plateTargetWeight, setPlateTargetWeight] = useState(isMetric ? 60 : 135);
  const [plateUnit, setPlateUnit] = useState(isMetric ? "kg" : "lbs");
  const [plateBarWeight, setPlateBarWeight] = useState(isMetric ? 20 : 45);

  // Calorie & Macro calculation
  const calculateCalories = () => {
    const age = Number(calAge);
    let height = Number(calHeight);
    let weight = Number(calWeight);
    const activity = Number(calActivity);

    if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
      toast.warn("Please enter valid positive numbers for age, height, and weight.");
      return;
    }

    // If imperial, convert to metric for Mifflin-St Jeor formula
    if (!isMetric) {
      height = height * 2.54;     // inches → cm
      weight = weight * 0.453592; // lbs → kg
    }

    // BMR using Mifflin-St Jeor
    let bmr = 0;
    if (calGender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = Math.round(bmr * activity);

    // Target Calories based on Goal
    let targetCalories = tdee;
    if (calGoal === "lose") {
      targetCalories = tdee - 500;
    } else if (calGoal === "gain") {
      targetCalories = tdee + 300;
    }

    // Ensure calories don't fall below a safe minimum
    if (targetCalories < 1200) targetCalories = 1200;

    // Macro Breakdown
    // Protein: 2.0g per kg of body weight
    const proteinGrams = Math.round(weight * 2.0);
    const proteinCalories = proteinGrams * 4;

    // Fats: 25% of target calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: remaining calories
    const carbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
    const carbGrams = Math.round(carbCalories / 4);

    setMacroResults({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      protein: { grams: proteinGrams, calories: proteinCalories, pct: Math.round((proteinCalories / targetCalories) * 100) },
      fat: { grams: fatGrams, calories: fatCalories, pct: Math.round((fatCalories / targetCalories) * 100) },
      carbs: { grams: carbGrams, calories: carbCalories, pct: Math.round((carbCalories / targetCalories) * 100) }
    });
  };

  // 1-Rep Max calculation
  const calculate1RM = () => {
    const weight = Number(rmWeight);
    const reps = Number(rmReps);

    if (!weight || !reps || weight <= 0 || reps <= 0) {
      toast.warn("Please enter valid positive numbers for weight and reps.");
      return;
    }

    // Epley formula: 1RM = w * (1 + r / 30)
    const epley = weight * (1 + reps / 30);
    // Brzycki formula: 1RM = w / (1.0278 - 0.0278 * r)
    const brzycki = weight / (1.0278 - 0.0278 * reps);

    // Average estimate
    const estimated1RM = Math.round((epley + brzycki) / 2);

    // Percentages split list
    const percentages = [
      { pct: 100, reps: 1, desc: "Max Effort (1RM)" },
      { pct: 95, reps: 2, desc: "Power / Peak Strength" },
      { pct: 90, reps: 4, desc: "Heavy Strength" },
      { pct: 85, reps: 6, desc: "Hypertrophy & Strength" },
      { pct: 80, reps: 8, desc: "Standard Hypertrophy" },
      { pct: 75, reps: 10, desc: "Hypertrophy & Endurance" },
      { pct: 70, reps: 12, desc: "Muscular Endurance" },
    ].map(p => ({
      ...p,
      weight: Math.round((estimated1RM * p.pct) / 100)
    }));

    setRmResults({
      exercise: rmExercise,
      estimated1RM,
      percentages
    });
  };

  // Save 1RM directly to user dashboard PRs
  const handleSaveToPRs = async () => {
    if (!user) {
      toast.warn("Please login to save PRs to your dashboard");
      return;
    }
    if (!rmResults) return;

    setIsSavingPR(true);
    try {
      const existingPRs = user.prs || [];
      const index = existingPRs.findIndex(
        (p) => p.exercise.toLowerCase() === rmResults.exercise.toLowerCase()
      );

      let updated = [];
      const newGoal = Math.round(rmResults.estimated1RM * 1.2);

      if (index !== -1) {
        updated = existingPRs.map((p, i) =>
          i === index
            ? { ...p, maxWeight: rmResults.estimated1RM, goalWeight: Math.max(p.goalWeight || 0, newGoal), unit: weightUnit }
            : p
        );
      } else {
        updated = [
          ...existingPRs,
          {
            exercise: rmResults.exercise,
            maxWeight: rmResults.estimated1RM,
            goalWeight: newGoal,
            unit: weightUnit,
          },
        ];
      }

      await updatePRs(dispatch, updated);
      toast.success(`Saved ${rmResults.exercise} (${rmResults.estimated1RM} ${weightUnit}) to your Dashboard PRs!`);
    } catch (err) {
      console.error("Failed to save PR:", err);
      toast.error("Failed to save to personal records");
    } finally {
      setIsSavingPR(false);
    }
  };

  return (
    <div className="fitness-tools-dashboard">
      <div className="fitness-tools-header">
        <h2 className="dashboard-title">Fitness Calculators & Tools</h2>
        <p className="dashboard-subtitle">
          Optimize your training, nutrition, and body composition with science-backed formulas.
        </p>
      </div>

      <div className="fitness-tools-tabs-nav">
        <button
          className={`tab-btn ${activeTab === "bmi" ? "active" : ""}`}
          onClick={() => setActiveTab("bmi")}
        >
          <CalculateIcon className="tab-icon" />
          <span>BMI Calculator</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "macros" ? "active" : ""}`}
          onClick={() => setActiveTab("macros")}
        >
          <LocalFireDepartmentIcon className="tab-icon" />
          <span>Calorie & Macros</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "rm" ? "active" : ""}`}
          onClick={() => setActiveTab("rm")}
        >
          <FitnessCenterIcon className="tab-icon" />
          <span>1-Rep Max</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "plates" ? "active" : ""}`}
          onClick={() => setActiveTab("plates")}
        >
          <CalculateIcon className="tab-icon" />
          <span>Barbell Plates</span>
        </button>
      </div>

      <div className="fitness-tools-content-wrapper">
        {/* Tab 1: BMI Calculator */}
        {activeTab === "bmi" && (
          <div className="tab-content-pane fade-in">
            <BmiCalculator />
          </div>
        )}

        {/* Tab 2: Calorie & Macros */}
        {activeTab === "macros" && (
          <div className="tab-content-pane fade-in">
            <div className="premium-calculator-card">
              <div className="card-header">
                <h3 className="card-title">
                  <LocalFireDepartmentIcon className="title-icon" />
                  <span>Calorie & Macronutrient Calculator</span>
                </h3>
                <p className="card-subtitle">
                  Calculate your daily calorie needs and optimal macronutrient split based on your goals.
                </p>
              </div>

              <div className="calculator-body">
                <div className="calculator-inputs-grid">
                  <div className="form-group">
                    <label>Gender</label>
                    <div className="radio-options-row">
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="cal-gender"
                          checked={calGender === "male"}
                          onChange={() => setCalGender("male")}
                        />
                        <span className="radio-label">Male</span>
                      </label>
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="cal-gender"
                          checked={calGender === "female"}
                          onChange={() => setCalGender("female")}
                        />
                        <span className="radio-label">Female</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cal-age">Age (years)</label>
                    <input
                      type="number"
                      id="cal-age"
                      placeholder="e.g. 25"
                      value={calAge}
                      onChange={(e) => setCalAge(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cal-height">Height ({heightUnit})</label>
                    <input
                      type="number"
                      id="cal-height"
                      placeholder={`e.g. ${isMetric ? "175" : "69"}`}
                      value={calHeight}
                      onChange={(e) => setCalHeight(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cal-weight">Weight ({weightUnit})</label>
                    <input
                      type="number"
                      id="cal-weight"
                      placeholder={`e.g. ${isMetric ? "70" : "155"}`}
                      value={calWeight}
                      onChange={(e) => setCalWeight(e.target.value)}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label htmlFor="cal-activity">Activity Level</label>
                    <select
                      id="cal-activity"
                      value={calActivity}
                      onChange={(e) => setCalActivity(e.target.value)}
                    >
                      <option value="1.2">Sedentary (Little or no exercise)</option>
                      <option value="1.375">Lightly Active (1-3 days/week of light exercise)</option>
                      <option value="1.55">Moderately Active (3-5 days/week of moderate exercise)</option>
                      <option value="1.725">Very Active (6-7 days/week of hard exercise)</option>
                      <option value="1.9">Extra Active (Very heavy exercise, physical job)</option>
                    </select>
                  </div>

                  <div className="form-group span-2">
                    <label htmlFor="cal-goal">Fitness Goal</label>
                    <select
                      id="cal-goal"
                      value={calGoal}
                      onChange={(e) => setCalGoal(e.target.value)}
                    >
                      <option value="lose">Lose Body Fat (-500 kcal deficit)</option>
                      <option value="maintain">Maintain Weight (TDEE)</option>
                      <option value="gain">Build Muscle (+300 kcal surplus)</option>
                    </select>
                  </div>
                </div>

                <div className="action-button-row">
                  <button className="calculate-btn" onClick={calculateCalories}>
                    Calculate Targets
                  </button>
                </div>

                {macroResults && (
                  <div className="results-display-section fade-in">
                    <div className="calories-summary-cards">
                      <div className="stat-card">
                        <span className="stat-label">BMR (Basal Metabolic Rate)</span>
                        <span className="stat-number">{macroResults.bmr} kcal</span>
                        <span className="stat-desc">Energy burned at rest</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">TDEE (Maintenance)</span>
                        <span className="stat-number">{macroResults.tdee} kcal</span>
                        <span className="stat-desc">Energy burned daily</span>
                      </div>
                      <div className="stat-card highlighted">
                        <span className="stat-label">Target Calories</span>
                        <span className="stat-number">{macroResults.targetCalories} kcal</span>
                        <span className="stat-desc">To reach your goal</span>
                      </div>
                    </div>

                    <h4 className="section-subtitle">Optimal Macronutrient Split</h4>
                    <div className="macros-progress-bars">
                      <div className="macro-progress-item carbs">
                        <div className="macro-info-row">
                          <span className="macro-name">Carbohydrates</span>
                          <span className="macro-values">
                            <strong>{macroResults.carbs.grams}g</strong> ({macroResults.carbs.calories} kcal)
                          </span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${macroResults.carbs.pct}%` }}></div>
                        </div>
                        <div className="macro-percentage">{macroResults.carbs.pct}% of daily intake</div>
                      </div>

                      <div className="macro-progress-item protein">
                        <div className="macro-info-row">
                          <span className="macro-name">Protein</span>
                          <span className="macro-values">
                            <strong>{macroResults.protein.grams}g</strong> ({macroResults.protein.calories} kcal)
                          </span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${macroResults.protein.pct}%` }}></div>
                        </div>
                        <div className="macro-percentage">{macroResults.protein.pct}% of daily intake</div>
                      </div>

                      <div className="macro-progress-item fat">
                        <div className="macro-info-row">
                          <span className="macro-name">Fat</span>
                          <span className="macro-values">
                            <strong>{macroResults.fat.grams}g</strong> ({macroResults.fat.calories} kcal)
                          </span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${macroResults.fat.pct}%` }}></div>
                        </div>
                        <div className="macro-percentage">{macroResults.fat.pct}% of daily intake</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 1-Rep Max */}
        {activeTab === "rm" && (
          <div className="tab-content-pane fade-in">
            <div className="premium-calculator-card">
              <div className="card-header">
                <h3 className="card-title">
                  <FitnessCenterIcon className="title-icon" />
                  <span>One-Rep Max (1RM) Calculator</span>
                </h3>
                <p className="card-subtitle">
                  Estimate your maximum single-repetition strength for any compound lift based on sub-maximal sets.
                </p>
              </div>

              <div className="calculator-body">
                <div className="calculator-inputs-grid">
                  <div className="form-group span-2">
                    <label htmlFor="rm-exercise">Select Exercise Lift</label>
                    <select
                      id="rm-exercise"
                      value={rmExercise}
                      onChange={(e) => setRmExercise(e.target.value)}
                    >
                      {POPULAR_1RM_EXERCISES.map((ex) => (
                        <option key={ex} value={ex}>
                          {ex}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="rm-weight">Weight Lifted ({weightUnit})</label>
                    <input
                      type="number"
                      id="rm-weight"
                      placeholder={`e.g. ${isMetric ? "80" : "185"}`}
                      value={rmWeight}
                      onChange={(e) => setRmWeight(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rm-reps">Reps Performed</label>
                    <select
                      id="rm-reps"
                      value={rmReps}
                      onChange={(e) => setRmReps(e.target.value)}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Rep{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="action-button-row">
                  <button className="calculate-btn" onClick={calculate1RM}>
                    Estimate 1RM
                  </button>
                </div>

                {rmResults && (
                  <div className="results-display-section fade-in">
                    <div className="rm-main-display">
                      <div className="rm-main-left">
                        <span className="rm-main-label">{rmResults.exercise} Estimated 1RM</span>
                        <span className="rm-main-number">
                          {rmResults.estimated1RM} <span className="unit">{weightUnit}</span>
                        </span>
                      </div>
                      <button
                        className="save-to-prs-btn"
                        onClick={handleSaveToPRs}
                        disabled={isSavingPR}
                        title="Save this record directly to your Dashboard PRs"
                      >
                        <BookmarkAddedIcon fontSize="small" />
                        <span>{isSavingPR ? "Saving..." : "Save to My PRs"}</span>
                      </button>
                    </div>

                    <h4 className="section-subtitle">Estimated Load Percentages</h4>
                    <div className="rm-table-wrapper">
                      <table className="rm-percentages-table">
                        <thead>
                          <tr>
                            <th>Percentage</th>
                            <th>Weight Load</th>
                            <th>Target Reps</th>
                            <th>Training Intensity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rmResults.percentages.map((p, idx) => (
                            <tr key={idx}>
                              <td><strong>{p.pct}%</strong></td>
                              <td>{p.weight} {weightUnit}</td>
                              <td>{p.reps} {p.reps === 1 ? "Rep" : "Reps"}</td>
                              <td><span className="intensity-tag">{p.desc}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Barbell Plate Calculator */}
        {activeTab === "plates" && (() => {
          const plateCalc = calculatePlates(
            Number(plateTargetWeight) || 0,
            plateUnit,
            Number(plateBarWeight) || (plateUnit === "lbs" ? 45 : 20)
          );
          const plateColors = plateUnit === "lbs" ? PLATE_COLORS_LBS : PLATE_COLORS_KG;
          const plateCounts = {};
          plateCalc.platesPerSide.forEach((p) => {
            plateCounts[p] = (plateCounts[p] || 0) + 1;
          });

          return (
            <div className="tab-content-pane fade-in">
              <div className="premium-calculator-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <CalculateIcon className="title-icon" />
                    <span>Barbell Plate Calculator</span>
                  </h3>
                  <p className="card-subtitle">
                    Calculate exact plates to load on each side of the barbell for any target weight with visual color-coded discs.
                  </p>
                </div>

                <div className="calculator-body">
                  <div className="plate-input-section" style={{ marginBottom: "20px" }}>
                    <div className="plate-field-group">
                      <label>Target Weight</label>
                      <div className="weight-stepper-input">
                        <button
                          type="button"
                          className="step-btn"
                          onClick={() => setPlateTargetWeight((w) => Math.max(plateBarWeight, Number(w) - (plateUnit === "lbs" ? 5 : 2.5)))}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={plateTargetWeight}
                          onChange={(e) => setPlateTargetWeight(e.target.value)}
                          min={plateBarWeight}
                          step={plateUnit === "lbs" ? 5 : 2.5}
                        />
                        <button
                          type="button"
                          className="step-btn"
                          onClick={() => setPlateTargetWeight((w) => Number(w) + (plateUnit === "lbs" ? 5 : 2.5))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="plate-field-group">
                      <label>Unit & Bar Weight</label>
                      <div className="unit-toggle-group">
                        <button
                          type="button"
                          className={`unit-btn ${plateUnit === "kg" ? "active" : ""}`}
                          onClick={() => {
                            setPlateUnit("kg");
                            setPlateBarWeight(20);
                            setPlateTargetWeight((w) => Math.round(w / 2.20462));
                          }}
                        >
                          KG (20kg Bar)
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${plateUnit === "lbs" ? "active" : ""}`}
                          onClick={() => {
                            setPlateUnit("lbs");
                            setPlateBarWeight(45);
                            setPlateTargetWeight((w) => Math.round(w * 2.20462));
                          }}
                        >
                          LBS (45lb Bar)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Realistic Centered Olympic Barbell Graphic */}
                  <div className="barbell-visualizer-container" style={{ marginBottom: "20px" }}>
                    <div className="barbell-graphic">
                      {/* Left Sleeve */}
                      <div className="barbell-sleeve-side left-side">
                        <div className="sleeve-outer-cap"></div>
                        <div className="sleeve-steel-bar">
                          <div className="plates-stack left">
                            {[...plateCalc.platesPerSide].reverse().map((p, idx) => (
                              <div
                                key={idx}
                                className={`plate-disc plate-${String(p).replace(".", "_")}`}
                                style={{
                                  backgroundColor: plateColors[p] || "#94a3b8",
                                  color: ["#ffffff", "#22c55e", "#eab308"].includes(plateColors[p]) ? "#000" : "#fff",
                                }}
                                title={`${p} ${plateUnit}`}
                              >
                                <span className="plate-text">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="sleeve-inner-collar"></div>
                      </div>

                      {/* Center Shaft */}
                      <div className="barbell-shaft-center">
                        <div className="shaft-knurling left-knurl"></div>
                        <div className="shaft-label-badge">
                          Bar: {plateCalc.barWeight} {plateUnit}
                        </div>
                        <div className="shaft-knurling right-knurl"></div>
                      </div>

                      {/* Right Sleeve */}
                      <div className="barbell-sleeve-side right-side">
                        <div className="sleeve-inner-collar"></div>
                        <div className="sleeve-steel-bar">
                          <div className="plates-stack right">
                            {plateCalc.platesPerSide.map((p, idx) => (
                              <div
                                key={idx}
                                className={`plate-disc plate-${String(p).replace(".", "_")}`}
                                style={{
                                  backgroundColor: plateColors[p] || "#94a3b8",
                                  color: ["#ffffff", "#22c55e", "#eab308"].includes(plateColors[p]) ? "#000" : "#fff",
                                }}
                                title={`${p} ${plateUnit}`}
                              >
                                <span className="plate-text">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="sleeve-outer-cap"></div>
                      </div>
                    </div>
                  </div>

                  {/* Plate Breakdown Summary */}
                  <div className="plate-summary-card">
                    <div className="summary-title-row">
                      <h4>Load Per Side: <strong>{plateCalc.perSideWeight} {plateUnit}</strong></h4>
                      <span className="total-loaded-badge">Total: {plateCalc.totalWeight} {plateUnit}</span>
                    </div>

                    {plateCalc.platesPerSide.length === 0 ? (
                      <p className="no-plates-note">Just the empty barbell ({plateCalc.barWeight} {plateUnit})</p>
                    ) : (
                      <div className="plate-chips-list">
                        {Object.keys(plateCounts).map((plateWeight) => (
                          <div key={plateWeight} className="plate-chip">
                            <span
                              className="chip-color-dot"
                              style={{ backgroundColor: plateColors[plateWeight] || "#00f0ff" }}
                            />
                            <span className="chip-count">{plateCounts[plateWeight]}×</span>
                            <span className="chip-weight">{plateWeight} {plateUnit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!plateCalc.exact && (
                      <div className="plate-remainder-warning">
                        ⚠️ Note: Small remainder of {plateCalc.remainder} {plateUnit} cannot be evenly loaded with standard plates.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default FitnessTools;
