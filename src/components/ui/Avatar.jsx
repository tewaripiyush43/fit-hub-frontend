import React, { useState } from "react";
import PropTypes from "prop-types";

export const Avatar = ({
  src,
  alt = "User Avatar",
  name = "",
  size = "md", // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  bordered = false,
  className = "",
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const classNames = [
    "fh-avatar",
    `fh-avatar--${size}`,
    bordered ? "fh-avatar--bordered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} {...props}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="fh-avatar__img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span className="fh-avatar__initials">{getInitials(name || alt)}</span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  bordered: PropTypes.bool,
  className: PropTypes.string,
};

export default Avatar;
