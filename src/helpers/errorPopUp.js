// Timestamp cache to throttle duplicate or rapid bursts of error popups
const recentErrors = new Map();
const THROTTLE_MS = 1800;

const dispatchToast = ({ type, message, duration = 4500, actionLabel, onAction }) => {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(
    new CustomEvent("fithub-toast", {
      detail: {
        type,
        message,
        duration,
        actionLabel,
        onAction,
      },
    })
  );
};

export const errorPopUp = (errorMessage) => {
  if (!errorMessage || typeof errorMessage !== "string") return;

  const cleanMessage = errorMessage.trim();
  if (!cleanMessage) return;

  let displayMessage = cleanMessage;
  if (
    cleanMessage.toLowerCase().includes("network error") ||
    cleanMessage.toLowerCase().includes("failed to fetch") ||
    cleanMessage.toLowerCase().includes("err_connection_refused")
  ) {
    displayMessage = "Unable to connect to server. Please check your connection or try again.";
  }

  const now = Date.now();
  const lastShown = recentErrors.get(displayMessage);
  if (lastShown && now - lastShown < THROTTLE_MS) {
    return;
  }
  recentErrors.set(displayMessage, now);

  if (recentErrors.size > 20) {
    for (const [key, time] of recentErrors.entries()) {
      if (now - time > 10000) recentErrors.delete(key);
    }
  }

  dispatchToast({ type: "error", message: displayMessage, duration: 5000 });
};

export const successPopUp = (successMessage) => {
  if (!successMessage || typeof successMessage !== "string") return;
  const cleanMessage = successMessage.trim();
  if (!cleanMessage) return;
  dispatchToast({ type: "success", message: cleanMessage, duration: 4500 });
};

export const infoPopUp = (infoMessage) => {
  if (!infoMessage || typeof infoMessage !== "string") return;
  const cleanMessage = infoMessage.trim();
  if (!cleanMessage) return;
  dispatchToast({ type: "info", message: cleanMessage, duration: 4000 });
};

export const warnPopUp = (warnMessage) => {
  if (!warnMessage || typeof warnMessage !== "string") return;
  const cleanMessage = warnMessage.trim();
  if (!cleanMessage) return;
  dispatchToast({ type: "warning", message: cleanMessage, duration: 4500 });
};

/**
 * Rich toast with an interactive action button (e.g. "Open Routine →")
 */
export const actionPopUp = ({ message, actionLabel = "View Routine →", onAction, duration = 5500 }) => {
  if (!message) return;
  dispatchToast({
    type: "success",
    message,
    actionLabel,
    onAction,
    duration,
  });
};

/**
 * Universal drop-in toast object compatible with react-toastify call signatures:
 * toast.success(...), toast.error(...), toast.info(...), toast.warn(...)
 */
export const toast = {
  success: (msg, opts = {}) => {
    dispatchToast({
      type: "success",
      message: msg,
      duration: typeof opts?.autoClose === "number" ? opts.autoClose : 4500,
    });
  },
  error: (msg, opts = {}) => {
    dispatchToast({
      type: "error",
      message: msg,
      duration: typeof opts?.autoClose === "number" ? opts.autoClose : 5000,
    });
  },
  info: (msg, opts = {}) => {
    dispatchToast({
      type: "info",
      message: msg,
      duration: typeof opts?.autoClose === "number" ? opts.autoClose : 4000,
    });
  },
  warn: (msg, opts = {}) => {
    dispatchToast({
      type: "warning",
      message: msg,
      duration: typeof opts?.autoClose === "number" ? opts.autoClose : 4500,
    });
  },
  warning: (msg, opts = {}) => {
    dispatchToast({
      type: "warning",
      message: msg,
      duration: typeof opts?.autoClose === "number" ? opts.autoClose : 4500,
    });
  },
  dismiss: (id) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fithub-toast-dismiss", { detail: { id } }));
    }
  },
};
