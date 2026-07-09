import React from "react";
import { Trello } from "react-feather";
import "./Navbar.css";
export default function Navbar(props) {
  return (
    <div className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">
          <Trello size={20} />
        </span>
        <h2>Flowboard</h2>
      </div>
      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          style={{ transition: "all 200ms" }}
          onChange={props.switchTheme}
        />
        <label for="checkbox" class="label">
          <i className="fas fa-moon fa-sm"></i>
          <i className="fas fa-sun fa-sm"></i>
          <div className="ball" />
        </label>
      </div>
    </div>
  );
}
