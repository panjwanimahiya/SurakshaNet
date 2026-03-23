import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/safety-tips", label: "Safety Tips" },
    { to: "/emergency-contacts", label: "Contacts" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">SafeHer</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
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
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
