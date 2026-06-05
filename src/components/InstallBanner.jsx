import React, { useState, useEffect } from "react";
import { usePwa } from "../context/PwaContext";
import CloseIcon from "@mui/icons-material/Close";
import GetAppIcon from "@mui/icons-material/GetApp";

const InstallBanner = () => {
  const { isInstallable, installApp, isAppInstalled } = usePwa();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("fithub-pwa-dismissed") === "true";
    setIsDismissed(dismissed);
  }, []);

  if (!isInstallable || isAppInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      localStorage.setItem("fithub-pwa-dismissed", "true");
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("fithub-pwa-dismissed", "true");
    setIsDismissed(true);
  };

  return (
    <div className="pwa-install-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <img src="/logo192.png" alt="FitHub Logo" />
        </div>
        <div className="banner-text">
          <h4>Install FitHub App</h4>
          <p>Get instant access, fast offline tracking, and native features!</p>
        </div>
      </div>
      <div className="banner-actions">
        <button className="install-btn" onClick={handleInstallClick}>
          <GetAppIcon />
          <span>Install</span>
        </button>
        <button
          className="dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
