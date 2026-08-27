import React from "react";
import PropTypes from "prop-types";

export const Badge = ({
  children,
  variant = "accent", // 'accent' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size = "md", // 'sm' | 'md'
  showDot = false,
  className = "",
  style = {},
  ...props
}) => {
  const classNames = [
    "fh-badge",
    `fh-badge--${variant}`,
    `fh-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classNames} style={style} {...props}>
      {showDot && <span className="fh-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["accent", "primary", "success", "warning", "danger", "info", "neutral"]),
  size: PropTypes.oneOf(["sm", "md"]),
  showDot: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Badge;
