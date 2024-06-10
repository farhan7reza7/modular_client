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

  const [invalidLogin, setInvalidLogin] = useState(false);
  const [invalidRegister, setInvalidRegister] = useState(false);
  const [invalidForget, setInvalidForget] = useState(false);
  const [invalidResetPassword, setInvalidResetPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidMfa, setInvalidMfa] = useState(false);

  const [messageForget, setMessageForget] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const [messageResetPassword, setMessageResetPassword] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messageMfa, setMessageMfa] = useState("");
  const [messageRegister, setMessageRegister] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
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

          if (
            JSON.parse(localStorage.getItem("logInner")) &&
            tokens &&
            userIds
          ) {
            fetch(`/api/verify-user?token=${tokens}&userId=${userIds}`, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.valid) {
                  setIsAuthenticated(true);
                  setToken(data.token);
                  setUserId(userIds);
                  setLogOutOnlyOtp(false);
                  localStorage.removeItem("logInner");
                  setLogOutOnlyReset(false);
                  localStorage.removeItem("logOutOnlyReset");
                }
              });
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
    }
  }, [query, isAuthenticated]);

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
          setInvalidLogin(false);
          setMessageLogin(data.message);
          setLogOutOnlyOtp(true);
          localStorage.setItem("logInner", JSON.stringify(true));
        } else {
          setInvalidLogin(true);
          setMessageLogin(data.message);
        }
      })
      .catch((error) => {
        setMessageLogin(error.message);
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
            setInvalidRegister(false);
            setMessageMfa(data.message);
            setLogOutOnlyOtp(true);
            localStorage.setItem("logInner", JSON.stringify(true));
            navigate(
              `../otp?token=${data.token}&username=${data.username}&password=${data.password}&email=${data.email}`
            );
          } else {
            setInvalidRegister(true);
            setMessageRegister(data.message);
          }
        })
        .catch((error) => {
          setMessageRegister(error.message);
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
          Authorization: `Bearer ${details.token}`,
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
            setInvalidMfa(false);
            setLogOutOnlyReset(false);
            setLogOutOnlyOtp(false);
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(data.userId));
            localStorage.removeItem("logInner");
            navigate("../");
          } else {
            setMessageMfa(data.message);
            setInvalidMfa(true);
          }
        })
        .catch((error) => {
          setMessageMfa(error.message);
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
          setMessageForget(data.message);
          setInvalidForget(false);
          setLogOutOnlyReset(true);
          localStorage.setItem("logOutOnlyReset", JSON.stringify(true));
        } else {
          setInvalidForget(true);
          setMessageForget(data.message);
        }
      })
      .catch((error) => {
        setMessageForget(error.message);
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
        setMessageEmail(data.message);
        setInvalidEmail(false);
      })
      .catch((error) => {
        setMessageEmail(error.message);
        setInvalidEmail(true);
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
            setMessageResetPassword(data.message);
            setUserId("");
            setToken("");
            setLogOutOnlyReset(false);
            setInvalidResetPassword(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("logOutOnlyReset");
            navigate("../login");
          } else {
            setInvalidResetPassword(true);
            setMessageResetPassword(data.message);
          }
        });
    },
    [navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        invalidLogin,
        invalidRegister,
        invalidForget,
        invalidResetPassword,
        userId,
        login,
        logout,
        register,
        token,
        forget,
        reset,
        messageLogin,
        logOutOnlyReset,
        logOutOnlyOtp,
        messageForget,
        messageEmail,
        messageRegister,
        messageResetPassword,
        verifyEmail,
        verifyMfa,
        messageMfa,
        user,
        invalidEmail,
        invalidMfa,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
