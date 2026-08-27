import React from "react";
import PropTypes from "prop-types";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "./Button";

export const ErrorState = ({
  icon = <ErrorOutlineIcon />,
  title = "Something went wrong",
  message = "An unexpected error occurred while processing your request.",
  onRetry = null,
  retryText = "Try Again",
  className = "",
}) => {
  return (
    <div className={`fh-state-container fh-state-container--error ${className}`}>
      <div className="fh-state__icon-wrapper">{icon}</div>
      <h3 className="fh-state__title">{title}</h3>
      <p className="fh-state__description">{message}</p>
      {onRetry && (
        <div className="fh-state__actions">
          <Button variant="danger" size="md" onClick={onRetry}>
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
};

ErrorState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.node,
  onRetry: PropTypes.func,
  retryText: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorState;
