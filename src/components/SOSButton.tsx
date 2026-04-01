import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Check, Loader2, Settings, MapPinOff } from "lucide-react";

type SOSState = "idle" | "confirming" | "sending" | "sent";
type LocationPermission = "prompt" | "granted" | "denied" | "unavailable";

const SOSButton = () => {
  const [state, setState] = useState<SOSState>("idle");
  const [locationPermission, setLocationPermission] = useState<LocationPermission>("prompt");
  const [showLocationSettings, setShowLocationSettings] = useState(false);

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission("unavailable");
      return;
    }
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setLocationPermission(result.state as LocationPermission);
        result.onchange = () => setLocationPermission(result.state as LocationPermission);
      } catch {
        setLocationPermission("prompt");
      }
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission("unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission("granted");
        setShowLocationSettings(false);
      },
      () => {
        setLocationPermission("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getContacts = (): { name: string; phone: string }[] => {
    try {
      return JSON.parse(localStorage.getItem("emergency_contacts") || "[]");
    } catch {
      return [];
    }
  };

  const handleSOS = () => {
    if (state === "idle") {
      checkPermission();
      setState("confirming");
      return;
    }

    if (state === "confirming") {
      setState("sending");

      if (!navigator.geolocation) {
        sendAlert(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          sendAlert(`https://www.google.com/maps?q=${latitude},${longitude}`);
        },
        () => {
          // Location denied/failed — still send alert without location
          sendAlert(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const sendAlert = (locationUrl: string | null) => {
    const contacts = getContacts();
    const locationLine = locationUrl
      ? `\n📍 My live location: ${locationUrl}`
      : "\n📍 Location unavailable";
    const message = encodeURIComponent(
      `🚨 EMERGENCY SOS! I need help immediately!${locationLine}\n⏰ Time: ${new Date().toLocaleString()}\nPlease contact me or send help!`
    );

    if (contacts.length === 0) {
      window.open(`https://wa.me/?text=${message}`, "_blank");
    } else {
      contacts.forEach((contact) => {
        const phone = contact.phone.replace(/[^0-9]/g, "");
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      });
    }

    setState("sent");
    setTimeout(() => setState("idle"), 4000);
  };

  const cancel = () => setState("idle");

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Pulsing rings */}
      {state === "idle" && (
        <>
          <div className="absolute w-48 h-48 rounded-full bg-sos/10 sos-ring" />
          <div className="absolute w-48 h-48 rounded-full bg-sos/10 sos-ring" style={{ animationDelay: "1s" }} />
        </>
      )}

      <motion.button
        onClick={handleSOS}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 w-40 h-40 rounded-full font-display font-bold text-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
          state === "idle"
            ? "bg-sos text-sos-foreground shadow-[var(--shadow-sos)] sos-pulse"
            : state === "confirming"
            ? "bg-warning text-warning-foreground shadow-[0_0_30px_hsl(var(--warning)/0.4)]"
            : state === "sending"
            ? "bg-warning text-warning-foreground"
            : "bg-safe text-safe-foreground shadow-[0_0_30px_hsl(var(--safe)/0.3)]"
        }`}
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-1">
              <AlertTriangle className="w-8 h-8" />
              <span>SOS</span>
            </motion.div>
          )}
          {state === "confirming" && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-1 text-base">
              <AlertTriangle className="w-7 h-7" />
              <span>TAP TO</span>
              <span>CONFIRM</span>
            </motion.div>
          )}
          {state === "sending" && (
            <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Sending...</span>
            </motion.div>
          )}
          {state === "sent" && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-1">
              <Check className="w-8 h-8" />
              <span className="text-sm">Alert Sent!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {state === "confirming" && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={cancel}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Cancel
        </motion.button>
      )}

      <p className="text-sm text-muted-foreground text-center max-w-[220px]">
        {state === "idle" && (
          <>
            <MapPin className="inline w-3.5 h-3.5 mr-1" />
            Shares your live location via WhatsApp
          </>
        )}
        {state === "confirming" && "Tap again to send emergency alert"}
        {state === "sent" && "Emergency contacts have been notified"}
      </p>

      {/* Location Settings Toggle */}
      <button
        onClick={() => { checkPermission(); setShowLocationSettings(!showLocationSettings); }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
        Location Settings
      </button>

      {/* Location Settings Panel */}
      <AnimatePresence>
        {showLocationSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-64 rounded-xl border bg-card p-4 text-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              {locationPermission === "granted" ? (
                <MapPin className="w-4 h-4 text-safe" />
              ) : (
                <MapPinOff className="w-4 h-4 text-sos" />
              )}
              <span className="font-medium text-foreground">
                {locationPermission === "granted" && "Location allowed ✓"}
                {locationPermission === "denied" && "Location blocked"}
                {locationPermission === "prompt" && "Location not set"}
                {locationPermission === "unavailable" && "Location not supported"}
              </span>
            </div>

            {locationPermission === "granted" ? (
              <p className="text-muted-foreground text-xs">
                Your location will be shared when you press SOS. To revoke, change it in your browser's site settings.
              </p>
            ) : locationPermission === "denied" ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  Location is blocked. To allow it:
                </p>
                <ol className="text-muted-foreground text-xs list-decimal pl-4 space-y-1">
                  <li>Click the lock/info icon in your browser's address bar</li>
                  <li>Find "Location" and set it to "Allow"</li>
                  <li>Reload the page</li>
                </ol>
                <p className="text-muted-foreground text-xs mt-2">
                  SOS will still work without location — alerts will be sent without a map link.
                </p>
              </div>
            ) : locationPermission === "unavailable" ? (
              <p className="text-muted-foreground text-xs">
                Your browser doesn't support location. SOS alerts will be sent without a map link.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  Allow location access so your SOS includes a map link for contacts.
                </p>
                <button
                  onClick={requestLocation}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Allow Location Access
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOSButton;
