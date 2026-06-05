import React, { createContext, useContext, useEffect, useState } from "react";

const PwaContext = createContext({
  isInstallable: false,
  installApp: async () => false,
  isAppInstalled: false,
});

export const usePwa = () => useContext(PwaContext);

export const PwaProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("PWA beforeinstallprompt event captured.");
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("FitHub app installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if app is already running in standalone mode (installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.warn("PWA install prompt is not available.");
      return false;
    }
    // Trigger prompt
    deferredPrompt.prompt();
    // Wait for response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    if (outcome === "accepted") {
      setIsAppInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return (
    <PwaContext.Provider value={{ isInstallable, installApp, isAppInstalled }}>
      {children}
    </PwaContext.Provider>
  );
};
