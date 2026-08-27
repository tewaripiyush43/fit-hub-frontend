import React from "react";
import PropTypes from "prop-types";

export const PageContainer = ({
  children,
  width = "default", // 'default' | 'narrow' | 'wide'
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div
      className={`fh-page-container fh-page-container--${width} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOf(["default", "narrow", "wide"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export const ResponsiveGrid = ({
  children,
  dense = false,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div
      className={`fh-responsive-grid ${dense ? "fh-responsive-grid--dense" : ""} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export const Stack = ({
  children,
  gap = "md", // 'sm' | 'md' | 'lg' | 'xl'
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div className={`fh-stack fh-stack--${gap} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  gap: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export const Inline = ({
  children,
  wrap = true,
  align = "start", // 'start' | 'center' | 'between'
  className = "",
  style = {},
  ...props
}) => {
  const classNames = [
    "fh-inline",
    !wrap ? "fh-inline--nowrap" : "",
    align === "between" ? "fh-inline--between" : align === "center" ? "fh-inline--center" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} style={style} {...props}>
      {children}
    </div>
  );
};

Inline.propTypes = {
  children: PropTypes.node.isRequired,
  wrap: PropTypes.bool,
  align: PropTypes.oneOf(["start", "center", "between"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export const StickyBottomBar = ({ children, className = "", style = {}, ...props }) => {
  return (
    <div className={`fh-sticky-bottom-bar ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

StickyBottomBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

const Layout = {
  PageContainer,
  ResponsiveGrid,
  Stack,
  Inline,
  StickyBottomBar,
};

export default Layout;
