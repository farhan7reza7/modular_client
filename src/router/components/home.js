import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../authContext";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`/api/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => {
        console.log(error.message);
      });
  }, [userId]);

  const handleAdd = useCallback(() => {
    fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: input, userId: userId }),
    })
      .then((res) => {
        fetch(`/api/tasks?userId=${userId}`, { method: "GET" })
          .then((res) => res.json())
          .then((data) => setTasks(data))
          .catch((error) => {
            console.log(error.message);
          });
        setInput("");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [input, userId]);

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
      <div className="component">
        Home page
        <div>
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
          </form>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Home;
