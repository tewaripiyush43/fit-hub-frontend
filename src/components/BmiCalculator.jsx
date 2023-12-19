import React from "react";

const BmiCalculator = () => {
  return (
    <div className="bmi-calculator">
      <form
        class="bmi-calculator-form"
        id="form"
        onsubmit="return validateForm()"
      >
        <h3 className="bmi-calculator-title">
          <b>B</b>ody <b>M</b>ass <b>I</b>ndex Calculator
        </h3>
        <div class="bmi-calculator-row row-one">
          <input
            type="text"
            class="bmi-calculator-input"
            id="age"
            autocomplete="off"
            required
          />
          <p class="bmi-calculator-input-text">Age</p>
          <label class="bmi-calculator-input-field-container">
            <input
              className="bmi-calculator-radio-input"
              type="radio"
              name="radio"
              id="f"
            />
            <p class="bmi-calculator-input-text">Female</p>
            <span class="bmi-calculator-checkmark"></span>
          </label>
          <label class="bmi-calculator-input-field-container">
            <input
              className="bmi-calculator-radio-input"
              type="radio"
              name="radio"
              id="m"
            />
            <p class="bmi-calculator-input-text">Male</p>
            <span class="bmi-calculator-checkmark"></span>
          </label>
        </div>

        <div class="bmi-calculator-row row-two">
          <input
            type="text"
            class="bmi-calculator-input"
            id="height"
            autocomplete="off"
            required
          />
          <p class="bmi-calculator-input-text">Height (cm)</p>
          <input
            type="text"
            class="bmi-calculator-input"
            id="weight"
            autocomplete="off"
            required
          />
          <p class="bmi-calculator-input-text">Weight (kg)</p>
        </div>
        <div className="bmi-calculator-row row-three">
          <p className="bmi-calculator-text">
            Your BMI is: &nbsp; <span id="bmi">NA</span>
          </p>
          <button
            className="bmi-calculator-submit-btn"
            type="button"
            id="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BmiCalculator;
