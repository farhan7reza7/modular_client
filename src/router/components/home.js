import { NavLink, Outlet } from "react-router-dom";

const Home = () => {
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
      <div className="component">Home page</div>
      <Outlet />
    </>
  );
};

export default Home;
