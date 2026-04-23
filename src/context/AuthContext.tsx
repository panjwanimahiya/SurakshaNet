import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string, token?: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: "",
  login: () => { },
  logout: () => { },
  getToken: () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("surakshanet_logged_in") === "true");
  const [userName, setUserName] = useState(() => localStorage.getItem("surakshanet_user_name") || "");

  const login = (name: string, token?: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem("surakshanet_logged_in", "true");
    localStorage.setItem("surakshanet_user_name", name);
    if (token) localStorage.setItem("surakshanet_token", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem("surakshanet_logged_in");
    localStorage.removeItem("surakshanet_user_name");
    localStorage.removeItem("surakshanet_token");
  };

  const getToken = () => localStorage.getItem("surakshanet_token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
