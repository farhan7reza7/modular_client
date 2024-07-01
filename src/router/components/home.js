import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../authContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { userId, token, user, setToken, setUserId } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const tn = query.get("token");
    const ur = query.get("userId");

    if (tn && ur) {
      fetch(`/api/verify-user?token=${tn}&userId=${ur}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            localStorage.setItem("token", JSON.stringify(data.token));
            localStorage.setItem("userId", JSON.stringify(ur));
          }
        });
    }
    if (!token && !userId) {
      setToken(tn);
      setUserId(ur);
    }
  }, []);

  const handleGet = useCallback(() => {
    fetch(`/api/tasks?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.tasks && setTasks(data.tasks);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [userId, token]);

  useEffect(() => {
    if (token) {
      handleGet();
    }
  }, [handleGet, token]);

  const handleAdd = useCallback(() => {
    fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: input, userId: userId }),
    })
      .then((res) => {
        handleGet();
        setInput("");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [input, userId, token, handleGet]);

  return (
    <>
      <nav className="navMain">
        <ul>
          <li>
            <NavLink to="/details">Details</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>
      <div className="component" style={{ overflow: "auto" }}>
        Home page
        <div>
          <p>user id: {userId}</p>
          <p>user: {user}</p>
          <h3>Tasks</h3>
          {tasks.map((el, index) => (
            <div key={el._id}>{el.content}</div>
          ))}
          <form>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <br />
            <button type="button" onClick={handleAdd}>
              Add new
            </button>
            <button type="button" onClick={handleGet}>
              Get Items
            </button>
          </form>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Home;
