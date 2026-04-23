import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length === 0) {
      setError("Please enter your password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user.name, data.token);
      toast({ title: "Login Successful", description: "Welcome back to SurakshaNet!" });
      navigate("/");
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10 select-none">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-10 transition-transform hover:scale-105 active:scale-95">
            <img src="/favicon.png" alt="SurakshaNet Logo" className="w-20 h-20 object-contain pointer-events-none" />
            <span className="font-display font-bold text-4xl text-foreground">Suraksha<span className="text-primary">Net</span></span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-4">Welcome Back</h1>
          <p className="text-muted-foreground text-xl">Log in to access your safety dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border-2 rounded-2xl p-8 md:p-10 shadow-[var(--shadow-elevated)] space-y-8">
          {error && <div className="text-destructive text-sm font-medium bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20 -mb-2">{error}</div>}
          <div className="space-y-4">
            <Label htmlFor="email" className="text-lg">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 text-lg" />
          </div>
          <div className="space-y-4">
            <Label htmlFor="password" className="text-lg">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 text-lg" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-14 text-xl font-bold mt-6 shadow-lg shadow-primary/20">Log In</Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
