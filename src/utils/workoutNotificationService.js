/**
 * Workout Push Notification & Background Sync Service
 * Handles Web Notifications, Service Worker sync, and Document Title updates
 */

let originalDocumentTitle = document.title || "FitHub";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const sendWorkoutNotification = (title, options = {}) => {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const defaultOptions = {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "fithub-workout-timer",
      renotify: true,
      vibrate: [200, 100, 200],
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = () => {
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
      notification.close();
    };

    // Auto close after 10s
    setTimeout(() => {
      try {
        notification.close();
      } catch (e) {}
    }, 10000);
  } catch (err) {
    console.warn("Could not display push notification:", err);
  }
};

export const setOriginalDocumentTitle = (title) => {
  if (title && !title.startsWith("[")) {
    originalDocumentTitle = title;
  }
};

export const updateDocumentTitle = (statusText) => {
  if (statusText) {
    document.title = `${statusText} | FitHub`;
  }
};

export const restoreDocumentTitle = () => {
  document.title = originalDocumentTitle || "FitHub - AI Workout Generator & Exercises";
};
