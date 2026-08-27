import React from "react";
import PropTypes from "prop-types";

export const StatCard = ({
  icon,
  label,
  value,
  unit,
  trend, // e.g. { direction: 'up' | 'down', text: '+2.5%' }
  className = "",
  style = {},
}) => {
  return (
    <div className={`fh-stat-card ${className}`} style={style}>
      {icon && <div className="fh-stat-card__icon-box">{icon}</div>}
      <div className="fh-stat-card__content">
        <span className="fh-stat-card__label">{label}</span>
        <div className="fh-stat-card__value-row">
          <span className="fh-stat-card__value">{value}</span>
          {unit && <span className="fh-stat-card__unit">{unit}</span>}
        </div>
        {trend && (
          <span
            className={`fh-stat-card__trend ${trend.direction === "up" ? "trend-up" : "trend-down"}`}
            style={{
              fontSize: "0.75rem",
              color: trend.direction === "up" ? "var(--success)" : "var(--danger)",
              marginTop: "2px",
            }}
          >
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(["up", "down"]),
    text: PropTypes.string,
  }),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default StatCard;
