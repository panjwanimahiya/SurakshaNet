import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Check, Loader2 } from "lucide-react";

type SOSState = "idle" | "confirming" | "sending" | "sent";

const SOSButton = () => {
  const [state, setState] = useState<SOSState>("idle");

  const getContacts = (): { name: string; phone: string }[] => {
    try {
      return JSON.parse(localStorage.getItem("emergency_contacts") || "[]");
    } catch {
      return [];
    }
  };

  const handleSOS = () => {
    if (state === "idle") {
      setState("confirming");
      return;
    }

    if (state === "confirming") {
      setState("sending");

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        setState("idle");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const contacts = getContacts();
          const message = encodeURIComponent(
            `🚨 EMERGENCY SOS! I need help immediately!\n📍 My live location: ${locationUrl}\n⏰ Time: ${new Date().toLocaleString()}\nPlease contact me or send help to this location!`
          );

          if (contacts.length === 0) {
            // Open WhatsApp with pre-filled message (user picks contact)
            window.open(`https://wa.me/?text=${message}`, "_blank");
          } else {
            // Send to each emergency contact
            contacts.forEach((contact) => {
              const phone = contact.phone.replace(/[^0-9]/g, "");
              window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
            });
          }

          setState("sent");
          setTimeout(() => setState("idle"), 4000);
        },
        (err) => {
          alert("Could not get your location. Please enable location services. Error: " + err.message);
          setState("idle");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
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
    </div>
  );
};

export default SOSButton;
