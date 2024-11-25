import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Tourism Management</h1>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
