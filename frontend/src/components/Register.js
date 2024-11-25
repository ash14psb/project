import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Customer",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering user with data:", formData);
    // Add API call here to register the user
  };

  return (
    <main className="register">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="Customer">Customer</option>
          <option value="Travel Agent">Travel Agent</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </main>
  );
}

export default Register;
