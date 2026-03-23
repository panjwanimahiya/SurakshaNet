import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: "",
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("safeher_logged_in") === "true");
  const [userName, setUserName] = useState(() => localStorage.getItem("safeher_user_name") || "");

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem("safeher_logged_in", "true");
    localStorage.setItem("safeher_user_name", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem("safeher_logged_in");
    localStorage.removeItem("safeher_user_name");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
