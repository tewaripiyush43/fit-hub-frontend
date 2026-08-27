import React from "react";
import PropTypes from "prop-types";

export const Skeleton = ({
  variant = "rect", // 'rect' | 'text' | 'circle' | 'card' | 'exercise-card'
  width,
  height,
  borderRadius,
  className = "",
  style = {},
  ...props
}) => {
  const inlineStyles = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
  };

  return (
    <div
      className={`fh-skeleton fh-skeleton--${variant} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["rect", "text", "circle", "card", "exercise-card"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Skeleton;
