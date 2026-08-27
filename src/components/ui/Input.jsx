import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      value,
      onChange,
      placeholder = "",
      error = "",
      helperText = "",
      disabled = false,
      required = false,
      iconStart = null,
      iconEnd = null,
      className = "",
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    const inputClasses = [
      "fh-input",
      iconStart ? "fh-input--has-icon-start" : "",
      iconEnd ? "fh-input--has-icon-end" : "",
      error ? "fh-input--error" : "",
      inputClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`fh-input-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="fh-input__label">
            {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
          </label>
        )}
        <div className="fh-input__wrapper">
          {iconStart && <div className="fh-input__icon-start">{iconStart}</div>}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {iconEnd && <div className="fh-input__icon-end">{iconEnd}</div>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="fh-input__error-msg">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className="fh-input__helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  iconStart: PropTypes.node,
  iconEnd: PropTypes.node,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default Input;
