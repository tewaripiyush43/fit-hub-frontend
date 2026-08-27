import React, { useState, useEffect, useRef, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/_fithubToast.scss";

let toastCounter = 0;

const ToastItem = ({ toast, onDismiss }) => {
  const { id, type = "info", message, actionLabel, onAction, duration = 4500 } = toast;
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);
  const isPausedRef = useRef(false);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = remainingTimeRef.current - elapsed;
      const pct = Math.max(0, (remaining / duration) * 100);
      setProgress(pct);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setIsExiting(true);
        setTimeout(() => onDismiss(id), 260);
      }
    }, 30);
  }, [duration, id, onDismiss]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    remainingTimeRef.current -= Date.now() - startTimeRef.current;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    startTimeRef.current = Date.now();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 260);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
      if (onAction) onAction();
    }, 150);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="toast-type-icon success" />;
      case "error":
        return <ErrorIcon className="toast-type-icon error" />;
      case "warn":
      case "warning":
        return <WarningIcon className="toast-type-icon warning" />;
      default:
        return <InfoIcon className="toast-type-icon info" />;
    }
  };

  return (
    <div
      className={`fithub-toast-card ${type} ${isExiting ? "exiting" : "entering"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      role="alert"
    >
      <div className="toast-main-row">
        <div className="toast-icon-wrap">{getIcon()}</div>
        <div className="toast-content-wrap">
          {typeof message === "string" ? (
            <div className="toast-message-text">{message}</div>
          ) : (
            message
          )}
          {actionLabel && (
            <button
              type="button"
              className="toast-inline-action-btn"
              onClick={handleActionClick}
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <CloseIcon style={{ fontSize: "1.1rem" }} />
        </button>
      </div>

      <div className="toast-progress-track">
        <div
          className={`toast-progress-fill ${type}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const FitHubToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { detail } = e;
      if (!detail) return;

      const newToast = {
        id: detail.id || `fithub-toast-${++toastCounter}-${Date.now()}`,
        type: detail.type || "info",
        message: detail.message,
        duration: detail.duration || 4500,
        actionLabel: detail.actionLabel,
        onAction: detail.onAction,
      };

      setToasts((prev) => {
        // Keep max 3 toasts visible at a time
        const updated = [...prev, newToast];
        if (updated.length > 3) {
          return updated.slice(updated.length - 3);
        }
        return updated;
      });
    };

    const handleDismissEvent = (e) => {
      const { detail } = e;
      if (detail?.id) {
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      } else {
        setToasts([]);
      }
    };

    window.addEventListener("fithub-toast", handleToastEvent);
    window.addEventListener("fithub-toast-dismiss", handleDismissEvent);

    return () => {
      window.removeEventListener("fithub-toast", handleToastEvent);
      window.removeEventListener("fithub-toast-dismiss", handleDismissEvent);
    };
  }, []);

  const handleDismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fithub-toast-container-root">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};

export default FitHubToastContainer;
