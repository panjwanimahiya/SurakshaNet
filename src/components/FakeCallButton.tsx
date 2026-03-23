import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, User } from "lucide-react";

const FakeCallButton = () => {
  const [ringing, setRinging] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const triggerCall = () => {
    setTimer(3);
  };

  useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) {
      setRinging(true);
      setTimer(null);
      return;
    }
    const id = setTimeout(() => setTimer((t) => (t !== null ? t - 1 : null)), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  if (ringing) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground flex flex-col items-center justify-between py-16"
        >
          <div className="flex flex-col items-center gap-4 mt-16">
            <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center">
              <User className="w-10 h-10 text-background" />
            </div>
            <p className="text-background text-2xl font-display font-bold">Mom</p>
            <p className="text-background/60 text-sm">Incoming Call...</p>
          </div>
          <div className="flex gap-16 mb-8">
            <button
              onClick={() => setRinging(false)}
              className="w-16 h-16 rounded-full bg-sos flex items-center justify-center"
            >
              <PhoneOff className="w-7 h-7 text-sos-foreground" />
            </button>
            <button
              onClick={() => setRinging(false)}
              className="w-16 h-16 rounded-full bg-safe flex items-center justify-center"
            >
              <Phone className="w-7 h-7 text-safe-foreground" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={triggerCall}
        disabled={timer !== null}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Phone className="w-4 h-4" />
        {timer !== null ? `Calling in ${timer}s...` : "Fake Call"}
      </button>
      <p className="text-xs text-muted-foreground">Simulates an incoming call</p>
    </div>
  );
};

export default FakeCallButton;
