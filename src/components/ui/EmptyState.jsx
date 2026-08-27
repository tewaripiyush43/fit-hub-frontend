import React from "react";
import PropTypes from "prop-types";
import InboxIcon from "@mui/icons-material/Inbox";

export const EmptyState = ({
  icon = <InboxIcon />,
  title = "No Data Found",
  description = "There are currently no items to display.",
  action = null,
  className = "",
}) => {
  return (
    <div className={`fh-state-container fh-state-container--empty ${className}`}>
      <div className="fh-state__icon-wrapper">{icon}</div>
      <h3 className="fh-state__title">{title}</h3>
      <p className="fh-state__description">{description}</p>
      {action && <div className="fh-state__actions">{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
