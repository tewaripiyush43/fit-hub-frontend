import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const Card = forwardRef(
  (
    {
      children,
      variant = "default", // 'default' | 'elevated' | 'glass' | 'interactive'
      padding = "md", // 'none' | 'sm' | 'md' | 'lg' | 'xl'
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === "interactive" || Boolean(onClick);

    const classNames = [
      "fh-card",
      `fh-card--${variant}`,
      `fh-card--pad-${padding}`,
      isInteractive ? "fh-card--interactive" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick && onClick(e);
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "elevated", "glass", "interactive"]),
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
