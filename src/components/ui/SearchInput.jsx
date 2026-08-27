import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const SearchInput = forwardRef(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      className = "",
      inputClassName = "",
      disabled = false,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`fh-input-group fh-search-group ${className}`}>
        <div className="fh-input__wrapper">
          <div className="fh-input__icon-start">
            <SearchIcon style={{ fontSize: "1.2rem" }} />
          </div>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`fh-input fh-input--has-icon-start ${value ? "fh-input--has-icon-end" : ""} ${inputClassName}`}
            {...props}
          />
          {value && onClear && (
            <button
              type="button"
              className="fh-input__clear-btn"
              onClick={onClear}
              aria-label="Clear search text"
            >
              <CloseIcon style={{ fontSize: "1.1rem" }} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default SearchInput;
