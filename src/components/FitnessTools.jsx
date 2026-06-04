import React, { useState } from "react";
import BmiCalculator from "./BmiCalculator";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const FitnessTools = () => {
  const [activeTab, setActiveTab] = useState("bmi");

  // Calorie & Macro State
  const [calAge, setCalAge] = useState("");
  const [calGender, setCalGender] = useState("male");
  const [calHeight, setCalHeight] = useState("");
  const [calWeight, setCalWeight] = useState("");
  const [calActivity, setCalActivity] = useState("1.375"); // Lightly active default
  const [calGoal, setCalGoal] = useState("maintain");
  const [macroResults, setMacroResults] = useState(null);

  // 1-Rep Max State
  const [rmWeight, setRmWeight] = useState("");
  const [rmReps, setRmReps] = useState("5");
  const [rmResults, setRmResults] = useState(null);

  // Calorie & Macro calculation
  const calculateCalories = () => {
    const age = Number(calAge);
    const height = Number(calHeight);
    const weight = Number(calWeight);
    const activity = Number(calActivity);

    if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
      alert("Please enter valid positive numbers for age, height, and weight.");
      return;
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
      alert("Please enter valid positive numbers for weight and reps.");
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
      { pct: 100, reps: 1, desc: "Max Effort" },
      { pct: 95, reps: 2, desc: "Power/Strength" },
      { pct: 90, reps: 4, desc: "Strength" },
      { pct: 85, reps: 6, desc: "Hypertrophy/Strength" },
      { pct: 80, reps: 8, desc: "Hypertrophy" },
      { pct: 75, reps: 10, desc: "Hypertrophy/Endurance" },
      { pct: 70, reps: 12, desc: "Endurance" },
    ].map(p => ({
      ...p,
      weight: Math.round((estimated1RM * p.pct) / 100)
    }));

    setRmResults({
      estimated1RM,
      percentages
    });
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
                    <label htmlFor="cal-height">Height (cm)</label>
                    <input
                      type="number"
                      id="cal-height"
                      placeholder="e.g. 175"
                      value={calHeight}
                      onChange={(e) => setCalHeight(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cal-weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="cal-weight"
                      placeholder="e.g. 70"
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
                  Estimate the maximum weight you can lift for a single repetition based on sub-maximal lifts.
                </p>
              </div>

              <div className="calculator-body">
                <div className="calculator-inputs-grid">
                  <div className="form-group">
                    <label htmlFor="rm-weight">Weight Lifted</label>
                    <input
                      type="number"
                      id="rm-weight"
                      placeholder="e.g. 80"
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
                      <span className="rm-main-label">Estimated One-Rep Max</span>
                      <span className="rm-main-number">{rmResults.estimated1RM} <span className="unit">kg/lbs</span></span>
                    </div>

                    <h4 className="section-subtitle">Estimated Load Percentages</h4>
                    <div className="rm-table-wrapper">
                      <table className="rm-percentages-table">
                        <thead>
                          <tr>
                            <th>Percentage</th>
                            <th>Weight Lift</th>
                            <th>Target Reps</th>
                            <th>Training Intensity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rmResults.percentages.map((p, idx) => (
                            <tr key={idx}>
                              <td><strong>{p.pct}%</strong></td>
                              <td>{p.weight} kg/lbs</td>
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
      </div>
    </div>
  );
};

export default FitnessTools;
