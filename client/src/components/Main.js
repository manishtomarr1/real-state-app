import React from "react";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../context/auth"; //for removing data when user login

export default function Main() {
  //context
  const [auth, setAuth] = useAuth(); //yeh value context provider se aari hai.

  //hooks
  const navigate = useNavigate();

  const logoutHandeler = () => {
    setAuth({ user: null, token: "", refreshToken: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const logenIn =
    auth.user !== null && auth.token !== "" && auth.refreshToken !== "";

  const handlePostAddClick = () => {
    if (logenIn) {
      navigate("/ad/create");
    } else {
      navigate("/login");
    }
  };
  return (
    <nav className="nav d-flex">
      <NavLink className="nav-link" aria-current="page" to="/">
        Home
      </NavLink>

      <NavLink className="nav-link" aria-current="page" to="/search">
        Search
      </NavLink>

      <NavLink className="nav-link" aria-current="page" to="/buy">
        buy
      </NavLink>

      <NavLink className="nav-link" aria-current="page" to="/rent">
        Rent
      </NavLink>


      <NavLink className="nav-link" aria-current="page" to="/agents">
        Agents
      </NavLink>
      <a className="nav-link pointer" onClick={handlePostAddClick}>post Ad</a>

      {!logenIn ? (
        <>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/register">
            Register
          </NavLink>
        </>
      ) : (
        ""
      )}

      {logenIn ? (
        <div className="dropdown ml-auto">
          <a
            className="btn  dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {auth?.user?.name ? auth.user.name : auth.user.username}
          </a>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <NavLink className="dropdown-item" to="/dashboard">
              Dashboard
            </NavLink>
            <button onClick={logoutHandeler} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </nav>
  );
}
