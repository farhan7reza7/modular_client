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

  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [logOutOnlyReset, setLogOutOnlyReset] = useState(false);
  const [logOutOnlyOtp, setLogOutOnlyOtp] = useState(false);

  const [invalidL, setInvalidL] = useState(false);
  const [invalidR, setInvalidR] = useState(false);
  const [invalidF, setInvalidF] = useState(false);
  const [invalidRP, setInvalidRP] = useState(false);
  //const [invalidE, setInvalidE] = useState(false);

  const [messageF, setMessageF] = useState("");
  const [messageL, setMessageL] = useState("");
  const [messageRP, setMessageRP] = useState("");
  const [messageE, setMessageE] = useState("");
  const [messageM, setMessageM] = useState("");
  const [messageR, setMessageR] = useState("");

  useEffect(() => {
    try {
      //handle data retainity on refresh
      const tokenz = JSON.parse(localStorage.getItem("token"));
      const id = JSON.parse(localStorage.getItem("userId"));
      if (tokenz && id) {
        setIsAuthenticated(true);
        setUserId(id);
        setToken(tokenz);
        setLogOutOnlyReset(false);
        setLogOutOnlyOtp(false);
        localStorage.removeItem("logOutOnlyReset");
        localStorage.removeItem("logInner");
      } else {
        //handle refresh on logged on for logging in through redirecting
        const tokens = query.get("token");
        const userIds = query.get("userId");
        if (JSON.parse(localStorage.getItem("logInner")) && tokens && userIds) {
          setIsAuthenticated(true);
          setToken(tokens);
          setUserId(userIds);
          setLogOutOnlyOtp(false);
          localStorage.removeItem("logInner");
          setLogOutOnlyReset(false);
          localStorage.removeItem("logOutOnlyReset");
        } else {
          if (JSON.parse(localStorage.getItem("logInner"))) {
            setLogOutOnlyOtp(true);
          }
          if (JSON.parse(localStorage.getItem("logOutOnlyReset"))) {
            setLogOutOnlyReset(true);
          }
        }
      }
    } catch (error) {
      localStorage.clear();
      setIsAuthenticated(false);
    }
  }, [query]);

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
          setInvalidL(false);
          setMessageL(data.message);
          setLogOutOnlyOtp(true);
          localStorage.setItem("logInner", JSON.stringify(true));
        } else {
          setInvalidL(true);
          setMessageL(data.message);
        }
      })
      .catch((error) => {
        setMessageL(error.message);
      });
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUserId("");
    setToken("");
    setUser("");
    localStorage.clear();
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
            setInvalidR(false);
            setMessageM(data.message);
            setLogOutOnlyOtp(true);
            localStorage.setItem("logInner", JSON.stringify(true));
            navigate(
              `../otp?token=${data.token}&username=${data.username}&password=${data.password}&email=${data.email}`
            );
          } else {
            setInvalidR(true);
            setMessageR(data.message);
          }
        })
        .catch((error) => {
          setMessageR(error.message);
        });
    },
    [navigate]
  );

  const verifyMfa = useCallback(
    async (details) => {
      fetch("/api/verify-mfa", {
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
            setToken(data.token);
            setUserId(data.userId);
            setUser(data.user);
            setLogOutOnlyReset(false);
            setLogOutOnlyOtp(false);
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(data.userId));
            localStorage.removeItem("logInner");
            navigate("../");
          } else {
            setMessageM(data.message);
          }
        })
        .catch((error) => {
          setMessageM(error.message);
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
          setInvalidF(false);
          setLogOutOnlyReset(true);
          localStorage.setItem("logOutOnlyReset", JSON.stringify(true));
        } else {
          setInvalidF(true);
          setMessageF(data.message);
        }
      })
      .catch((error) => {
        setMessageF(error.message);
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
            //setIsAuthenticated(false);
            setUserId("");
            setToken("");
            setLogOutOnlyReset(false);
            setInvalidRP(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("logOutOnlyReset");
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
        logOutOnlyReset,
        logOutOnlyOtp,
        messageF,
        messageE,
        messageR,
        messageRP,
        verifyEmail,
        verifyMfa,
        messageM,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
