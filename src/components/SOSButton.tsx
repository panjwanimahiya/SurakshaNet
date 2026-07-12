import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Check, Loader2, Settings, MapPinOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type SOSState = "idle" | "sending" | "sent";
type LocationPermission = "prompt" | "granted" | "denied" | "unavailable";

const SOSButton = () => {
  const [state, setState] = useState<SOSState>("idle");
  const [locationPermission, setLocationPermission] = useState<LocationPermission>("prompt");
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [activeInterval, setActiveInterval] = useState<any>(null);

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

  const [contacts, setContacts] = useState<any[]>([]);
  const { getToken, userName } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/contacts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (e) {
        console.error("Failed to load contacts for SOS");
      }
    };
    fetchContacts();
  }, [getToken]);

  const stopSOS = () => {
    if (activeInterval) clearInterval(activeInterval);
    setActiveInterval(null);
    setState("idle");
  };

  const dispatchSOSRound = (isFirst: boolean = false) => {
    if (!navigator.geolocation) {
      sendAlert(null, isFirst);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sendAlert(`https://www.google.com/maps?q=${latitude},${longitude}`, isFirst);
      },
      () => sendAlert(null, isFirst), // Location denied/failed
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSOS = () => {
    if (state === "idle") {
      checkPermission();
      setState("sending");
      
      // Force automatic physical delivery immediately
      dispatchSOSRound(true);

      // Initiate continuous real-time broadcast loop (every 15 seconds) SILENTLY
      const id = setInterval(() => {
        dispatchSOSRound(false);
      }, 15000);
      setActiveInterval(id);
    } else if (state === "sent" || state === "sending") {
      stopSOS();
    }
  };

  const sendAlert = async (locationUrl: string | null, isFirst: boolean = false) => {
    const locationLine = locationUrl
      ? `\n📍 My live location: ${locationUrl}`
      : "\n📍 Location unavailable (Please check GPS)";
    const rawMessage = `🚨 EMERGENCY SOS! This is ${userName || 'User'}. I am in danger and need help immediately!${locationLine}\n⏰ Time: ${new Date().toLocaleString()}\nPlease contact me or send help immediately!`;

    if (!locationUrl && isFirst) {
      toast.warning("Location unavailable. Sending alert without coordinates.", {
        icon: <MapPinOff className="w-4 h-4" />
      });
    }

    // Trigger the browser's WhatsApp intent (shows the "Open WhatsApp?" popup)
    if (isFirst && contacts.length > 0) {
      const primaryPhone = contacts[0].phone.replace(/[^0-9]/g, "");
      const whatsappUrl = `whatsapp://send?phone=${primaryPhone}&text=${encodeURIComponent(rawMessage)}`;
      
      // Using a small timeout to ensure geolocation toast/state updates are visible first
      setTimeout(() => {
        window.location.assign(whatsappUrl);
      }, 500);
    }

    // Silently and automatically dispatch across the SurakshaNet server
    try {
      const token = getToken();
      if (token) {
        const response = await fetch("http://localhost:5000/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ locationUrl, message: rawMessage })
        });
        
        if (response.ok) {
          if (isFirst) {
            toast.success("SOS Alert Initiated!", {
              description: "WhatsApp is opening and background dispatch is active.",
              duration: 5000
            });
          }
        } else {
          const errorData = await response.json();
          toast.error("Background Dispatch Error", {
            description: errorData.error || "Manual WhatsApp sending recommended.",
            icon: <AlertCircle className="w-4 h-4" />
          });
        }
      }
    } catch (e) {
      console.error("Background dispatch failed:", e);
    }

    setState("sent"); // Stays visually active until stopped!
  };

  const cancel = () => setState("idle");

  return (
    <div className="relative flex flex-col items-center gap-8">
      {/* Pulsing rings */}
      {(state === "idle" || state === "sent") && (
        <>
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-sos/10 sos-ring top-[-25px] md:top-[-80px]" />
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-sos/10 sos-ring top-[-25px] md:top-[-80px]" style={{ animationDelay: "1s" }} />
        </>
      )}

      <motion.button
        onClick={handleSOS}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 w-64 h-64 md:w-72 md:h-72 rounded-full font-display font-bold text-4xl md:text-5xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${state === "idle"
            ? "bg-sos text-sos-foreground shadow-[var(--shadow-sos)] sos-pulse"
            : state === "sending"
                ? "bg-warning text-warning-foreground"
                : "bg-sos text-sos-foreground shadow-[0_0_80px_hsl(var(--sos)/0.7)] sos-pulse"
          }`}
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 mb-2" />
              <span>SOS</span>
            </motion.div>
          )}
          {state === "sending" && (
            <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <Loader2 className="w-14 h-14 md:w-16 md:h-16 animate-spin" />
              <span className="text-2xl">Sending...</span>
            </motion.div>
          )}
          {state === "sent" && (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin mb-1" />
              <span className="text-3xl text-center">ACTIVE</span>
              <span className="text-sm opacity-90 tracking-widest">(TAP TO STOP)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>


      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-[300px]">
        {state === "idle" && (
          <>
            <MapPin className="inline w-5 h-5 mr-2" />
            Shares your live location via internet
          </>
        )}
        {state === "sent" && (
           <span className="text-sos font-bold animate-pulse">Broadcasting live location directly to contacts every 15s...</span>
        )}
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
