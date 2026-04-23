import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, userName, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/safety-tips", label: "Safety Tips" },
    { to: "/emergency-contacts", label: "Contacts" },
    { to: "/nearby-help", label: "Nearby Help" },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b-2">
      <div className="w-full flex items-center justify-between h-28 px-4 md:px-12 lg:px-20 mx-auto">
        <Link to="/" className="flex items-center gap-5 transition-transform hover:scale-105 active:scale-95">
          <img src="/favicon.png" alt="SurakshaNet Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
          <span className="font-display font-extrabold text-4xl lg:text-5xl text-foreground tracking-tight">
            Suraksha<span className="text-red-600">Net</span>
          </span>
        </Link>

        <div className="hidden xl:flex flex-1 justify-center items-center gap-10 lg:gap-16">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-xl lg:text-2xl font-black transition-all hover:text-primary uppercase tracking-wider ${location.pathname === l.to ? "text-primary border-b-4 border-primary pb-2" : "text-muted-foreground/80"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-6 xl:gap-8 border-l-2 border-border pl-6 xl:pl-8">
              <span className="text-xl lg:text-2xl font-bold text-foreground">Hi, <span className="text-primary">{userName}</span></span>
              <Button variant="outline" onClick={handleLogout} className="gap-3 text-lg lg:text-xl font-bold shadow-sm h-14 lg:h-16 px-6 lg:px-8 border-2 rounded-xl">
                <LogOut className="w-6 h-6" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l-2 border-border pl-6 xl:pl-8">
              <Link to="/login">
                <Button variant="outline" className="text-lg lg:text-xl font-bold shadow-sm h-14 lg:h-16 px-6 lg:px-8 border-2 rounded-xl hover:bg-secondary">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-lg lg:text-xl font-bold shadow-lg shadow-primary/20 h-14 lg:h-16 px-6 lg:px-8 rounded-xl">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <button className="xl:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
