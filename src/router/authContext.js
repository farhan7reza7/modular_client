import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [invalidL, setInvalidL] = useState(false);
  const [invalidR, setInvalidR] = useState(false);
  const [invalidF, setInvalidF] = useState(false);
  const [invalidRP, setInvalidRP] = useState(false);

  const [userId, setUser] = useState("");
  const [token, setToken] = useState("");

  const [re, setRe] = useState(false);

  const [messageF, setMessageF] = useState("");
  const [messageL, setMessageL] = useState("");
  const [messageRP, setMessageRP] = useState("");
  const [messageE, setMessageE] = useState("");

  useEffect(() => {
    try {
      const tokenz = JSON.parse(localStorage.getItem("token"));
      const id = JSON.parse(localStorage.getItem("userId"));

      if (tokenz) {
        const reS = JSON.parse(localStorage.getItem("re"));
        if (reS) {
          setRe(reS);
        } else {
          setIsAuthenticated(true);
          setUser(id);
          setToken(tokenz);
        }
      } else {
        const tokens = query.get("token");
        const userIds = query.get("userId");
        if (JSON.parse(localStorage.getItem("ve")) && tokens && userIds) {
          setIsAuthenticated(true);
          setToken(tokens);
          setUser(userIds);
        }
      }
    } catch (error) {
      localStorage.clear();
    }
  }, []);

  const navigate = useNavigate();

  const login = useCallback(async (details) => {
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
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setInvalidL(false);
          setMessageL(data.message);
          localStorage.setItem("ve", JSON.stringify(true));
        } else {
          setInvalidL(true);
          setMessageL(data.message);
        }
      });
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser("");
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("ve");
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

  const forget = useCallback(async (details) => {
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
          setMessageF(data.message);
          setUser(data.userId);
          setToken(data.token);
          setInvalidF(false);
          setRe(true);
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("userId", JSON.stringify(data.userId));
          localStorage.setItem("re", JSON.stringify(true));
        } else {
          setInvalidF(true);
          setMessageF(data.message);
        }
      });
  }, []);

  const verifyEmail = useCallback(async (details) => {
    fetch("/api/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessageE(data.message);
      })
      .catch((error) => {
        setMessageE(error.message);
      });
  }, []);

  const reset = useCallback(
    async (details) => {
      fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${details.token}`,
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setMessageRP(data.message);
            setIsAuthenticated(false);
            setUser("");
            setToken("");
            setRe(false);
            setInvalidRP(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("re");
            navigate("../login");
          } else {
            setInvalidRP(true);
            setMessageRP(data.message);
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
        invalidR,
        invalidF,
        invalidRP,
        userId,
        login,
        logout,
        register,
        token,
        forget,
        reset,
        messageL,
        re,
        messageF,
        messageE,
        messageRP,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
