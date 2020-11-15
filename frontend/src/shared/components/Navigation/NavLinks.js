import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);
  
  return (
    <ul className="nav-links">
      {/* <li>
        <NavLink to="/" exact>
          ALL Employer
        </NavLink>
      </li> */}
      {auth.isLoggedIn && auth.employer &&(
        <>
        <li>
          <NavLink to={`/${auth.userId}/jobs`}>My Job</NavLink>
        </li>
        <li>
          <NavLink to="/job/new">Add Job</NavLink>
        </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Log in / Register</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
