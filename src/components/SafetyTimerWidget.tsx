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
    <div className="bg-card border rounded-xl p-5 shadow-[var(--shadow-card)] max-w-xs w-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Safety Timer</h3>
      </div>

      {!running && !expired ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Minutes:</label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="bg-muted rounded-md px-3 py-1.5 text-sm text-foreground border-0"
            >
              {[5, 10, 15, 30, 45, 60].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
          <Button onClick={start} className="w-full gap-2" size="sm">
            <Play className="w-4 h-4" /> Start Timer
          </Button>
        </div>
      ) : running ? (
        <div className="space-y-3 text-center">
          <p className="text-3xl font-display font-bold text-foreground">{formatTime(secondsLeft!)}</p>
          <p className="text-xs text-muted-foreground">Check in before timer expires</p>
          <div className="flex gap-2">
            <Button onClick={checkin} variant="default" size="sm" className="flex-1 gap-1 bg-safe hover:bg-safe/90 text-safe-foreground">
              <Check className="w-4 h-4" /> I'm Safe
            </Button>
            <Button onClick={stop} variant="outline" size="sm" className="flex-1 gap-1">
              <Square className="w-4 h-4" /> Stop
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-sm text-sos font-semibold">⚠️ Timer Expired</p>
          <Button onClick={() => { setExpired(false); setSecondsLeft(null); }} variant="outline" size="sm" className="w-full">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default SafetyTimerWidget;
