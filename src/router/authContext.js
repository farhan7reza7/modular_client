import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [invalidL, setInvalidL] = useState(false);
  const [invalidR, setInvalidR] = useState(false);
  const [userId, setUser] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const login = useCallback(
    async (details) => {
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
            setInvalidL(false);
            setUser(data.userId);
            setToken(data.token);
            navigate("../");
          } else {
            setInvalidL(true);
          }
        });
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser("");
    setToken("");
    //navigate("../login");
  }, []);

  const register = useCallback(
    async (details) => {
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
            setInvalidR(false);
            setUser(data.userId);
            setToken(data.token);
            navigate("../");
          } else {
            setInvalidR(true);
          }
        });
    },
    [navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        invalidL,
        userId,
        invalidR,
        login,
        logout,
        register,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
