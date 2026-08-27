import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const IconButton = forwardRef(
  (
    {
      icon,
      ariaLabel,
      circle = false,
      subtle = false,
      disabled = false,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const classNames = [
      "fh-icon-btn",
      circle ? "fh-icon-btn--circle" : "",
      subtle ? "fh-icon-btn--subtle" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  circle: PropTypes.bool,
  subtle: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconButton;
