import { useState, useEffect, useRef } from "react";
import { Clock, Play, Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const SafetyTimerWidget = () => {
  const [minutes, setMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setExpired(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Auto-trigger SOS-like alert
      alert("⚠️ Safety timer expired! Emergency contacts would be notified.");
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [secondsLeft]);

  const start = () => {
    setExpired(false);
    setSecondsLeft(minutes * 60);
  };

  const stop = () => {
    setSecondsLeft(null);
    setExpired(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const checkin = () => {
    stop();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const running = secondsLeft !== null && !expired;

  return (
    <div className="bg-card border-2 rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] max-w-sm w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-8 h-8 text-primary" />
        <h3 className="font-display font-semibold text-xl md:text-2xl text-foreground">Safety Timer</h3>
      </div>

      {!running && !expired ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <label className="text-lg font-medium text-muted-foreground">Minutes:</label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="bg-muted rounded-xl px-4 py-3 text-lg font-bold text-foreground border-0 w-32 outline-none"
            >
              {[5, 10, 15, 30, 45, 60].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
          <Button onClick={start} className="w-full gap-3 h-14 text-lg font-bold shadow-lg mt-2 cursor-pointer" size="lg">
            <Play className="w-5 h-5" /> Start Timer
          </Button>
        </div>
      ) : running ? (
        <div className="space-y-4 text-center">
          <p className="text-5xl md:text-6xl font-display font-black text-foreground tracking-wider">{formatTime(secondsLeft!)}</p>
          <p className="text-sm md:text-base text-muted-foreground pb-2">Check in before timer expires</p>
          <div className="flex gap-4">
            <Button onClick={checkin} variant="default" size="lg" className="flex-1 gap-2 h-14 bg-safe hover:bg-safe/90 text-safe-foreground font-bold text-lg shadow-lg cursor-pointer">
              <Check className="w-6 h-6" /> I'm Safe
            </Button>
            <Button onClick={stop} variant="outline" size="lg" className="flex-1 gap-2 h-14 font-bold text-lg border-2 cursor-pointer">
              <Square className="w-6 h-6" /> Stop
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4 pt-2">
          <p className="text-xl text-sos font-bold">⚠️ Timer Expired</p>
          <Button onClick={() => { setExpired(false); setSecondsLeft(null); }} variant="outline" size="lg" className="w-full h-14 font-bold text-lg border-2 cursor-pointer">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default SafetyTimerWidget;
