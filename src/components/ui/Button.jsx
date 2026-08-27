import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary", // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
      size = "md", // 'sm' | 'md' | 'lg'
      fullWidth = false,
      loading = false,
      disabled = false,
      iconStart = null,
      iconEnd = null,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const classNames = [
      "fh-btn",
      `fh-btn--${variant}`,
      `fh-btn--${size}`,
      fullWidth ? "fh-btn--full" : "",
      loading ? "fh-btn--loading" : "",
      disabled ? "fh-btn--disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <span className="fh-btn__spinner" aria-hidden="true" />
        ) : (
          iconStart && <span className="fh-btn__icon fh-btn__icon--start">{iconStart}</span>
        )}
        <span className="fh-btn__text">{children}</span>
        {!loading && iconEnd && <span className="fh-btn__icon fh-btn__icon--end">{iconEnd}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "accent", "outline", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  iconStart: PropTypes.node,
  iconEnd: PropTypes.node,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
