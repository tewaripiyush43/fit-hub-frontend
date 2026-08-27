import React from "react";
import PropTypes from "prop-types";

export const SectionHeader = ({
  tag,
  title,
  subtitle,
  actions = null,
  className = "",
  titleIcon = null,
}) => {
  return (
    <header className={`fh-section-header ${className}`}>
      <div className="fh-section-header__text-group">
        {tag && <span className="fh-section-header__tag">{tag}</span>}
        <h2 className="fh-section-header__title">
          {titleIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{titleIcon}</span>}
          {title}
        </h2>
        {subtitle && <p className="fh-section-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="fh-section-header__actions">{actions}</div>}
    </header>
  );
};

SectionHeader.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
  titleIcon: PropTypes.node,
};

export default SectionHeader;
