import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import DiditSearch from "../features/Didits/DiditSearch";

const Navbar = ({ projects, notApp }) => {
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    window.localStorage.clear();
  };
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/app/all">
          <p className="btn btn-ghost normal-case text-xl">toDidit</p>
        </Link>
      </div>

      {!notApp && <DiditSearch projects={projects} />}
      <div className="dropdown dropdown-end">
        <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
          {user && (
            <div className="w-10 rounded-full">
              <img
                src={`https://avatars.dicebear.com/api/initials/${user.username[0]}.svg`}
              />
            </div>
          )}
        </label>
        <ul
          tabIndex="0"
          className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/profile">
              <p className="justify-between">Profile</p>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <p>Settings</p>
            </Link>
          </li>
          <li>
            <form onSubmit={() => handleLogout()}>
              <button type="submit">Logout</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
