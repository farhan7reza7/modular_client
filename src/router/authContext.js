import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [invalidL, setInvalidL] = useState(false);
  const [invalidR, setInvalidR] = useState(false);
  const [userId, setUser] = useState("");
  const [token, setToken] = useState("");
  const [re, setRe] = useState(false);

  useEffect(() => {
    const tokenz = JSON.parse(localStorage.getItem("token"));
    const id = JSON.parse(localStorage.getItem("userId"));
    if (tokenz) {
      setIsAuthenticated(true);
      setUser(id);
      setToken(tokenz);
    }
  }, []);

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
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(data.userId));
            navigate("../");
          } else {
            setInvalidL(true);
          }
        });
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser("");
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(data.userId));
            navigate("../");
          } else {
            setInvalidR(true);
          }
        });
    },
    [navigate]
  );

  const forget = useCallback(
    async (details) => {
      fetch("/api/forget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setUser(data.userId);
            setToken(data.token);
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(data.userId));
            setRe(true);
            navigate("../reset");
          }
        });
    },
    [navigate]
  );

  const reset = useCallback(
    async (details) => {
      fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(false);
            setUser("");
            setToken("");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setRe(false);
            navigate("../login");
          }
        });
    },
    [navigate, token]
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
        forget,
        reset,
        re,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
