import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FakeCallButton = () => {
  const [ringing, setRinging] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const { getToken } = useAuth();

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
        console.error("Failed to load contacts for Fake Call");
      }
    };
    fetchContacts();
  }, [getToken]);

  const triggerCall = () => {
    setCurrentContactIndex(0);
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

  const handleDecline = () => {
    setRinging(false);
    // If user declines, automatically call from the next family member after 2 seconds
    if (contacts.length > 0 && currentContactIndex < contacts.length - 1) {
      setCurrentContactIndex(prev => prev + 1);
      setTimeout(() => setRinging(true), 2000);
    }
  };

  const handleAccept = () => {
    setRinging(false);
    // Actually initiates the outbound native call
    if (contacts.length > 0 && contacts[currentContactIndex]) {
      const phone = contacts[currentContactIndex].phone.replace(/[^0-9+]/g, "");
      window.location.href = `tel:${phone}`;
    }
  };

  const currentCallerName = contacts.length > 0 && contacts[currentContactIndex] 
    ? contacts[currentContactIndex].name 
    : "Mom";

  if (ringing) {
    return (
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] bg-background/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm bg-card border-2 shadow-2xl rounded-[2rem] p-8 flex flex-col items-center tap-highlight-transparent"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground text-3xl font-display font-bold">{currentCallerName}</p>
            <p className="text-muted-foreground text-lg mb-10">Incoming Call...</p>
            
            <div className="flex gap-12 w-full justify-center">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleDecline}
                  className="w-16 h-16 rounded-full bg-sos flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
                >
                  <PhoneOff className="w-8 h-8 text-sos-foreground" />
                </button>
                <span className="text-sm text-muted-foreground font-medium">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="w-16 h-16 rounded-full bg-safe flex items-center justify-center shadow-lg hover:brightness-110 transition-all animate-pulse"
                >
                  <Phone className="w-8 h-8 text-safe-foreground" />
                </button>
                <span className="text-sm text-muted-foreground font-medium">Answer</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 -mt-2">
      <button
        onClick={triggerCall}
        disabled={timer !== null}
        className="flex items-center justify-center gap-3 w-56 md:w-64 h-16 rounded-full bg-foreground text-background font-bold text-lg md:text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Phone className="w-6 h-6" />
        {timer !== null ? `Calling in ${timer}s...` : "Fake Call"}
      </button>
      <p className="text-sm md:text-base text-muted-foreground">Simulates an incoming call</p>
    </div>
  );
};

export default FakeCallButton;
