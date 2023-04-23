import React, { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const { dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerFormDataHandler = (e) => {
    e.preventDefault();

    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    if (
      registerFormData.name === "" ||
      registerFormData.email === "" ||
      registerFormData.password === ""
    ) {
      return alert("You must provide all values");
    }

    setLoading(true);

    const response = await fetch(
      "https://mern-todo-app-roan.vercel.app/api/v1/auth/register",
      {
        method: "POST",
        body: JSON.stringify(registerFormData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const jsonData = await response.json();

    if (!response.ok) {
      alert("there was an error ");
      setLoading(false);
    }
    if (response.ok) {
      setRegisterFormData({
        name: "",
        email: "",
        password: "",
      });
      dispatch({ type: "LOGIN", payload: jsonData });
      localStorage.setItem("userToken", JSON.stringify(jsonData));
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="form-text">REGISTER FIRST TO USE THE APP</h2>

      <form className="register container mt-5" onSubmit={submitFormHandler}>
  <h3 className="text-center mb-4">Register Here</h3>
  <div className="form-group">
    <label htmlFor="name">Name :</label>
    <input
      value={registerFormData.name}
      onChange={registerFormDataHandler}
      name="name"
      type="text"
      placeholder="Enter your Name"
      className="form-control"
      id="name"
    />
  </div>
  <div className="form-group">
    <label htmlFor="email">Email :</label>
    <input
      value={registerFormData.email}
      onChange={registerFormDataHandler}
      name="email"
      type="email"
      placeholder="Enter your Email"
      className="form-control"
      id="email"
    />
  </div>
  <div className="form-group">
    <label htmlFor="password">Password :</label>
    <input
      value={registerFormData.password}
      onChange={registerFormDataHandler}
      type="password"
      placeholder="Enter your Password"
      className="form-control"
      name="password"
      id="password"
    />
  </div>
  {loading ? (
    <button className="btn btn-primary loading-btn" onClick={submitFormHandler}>
      Submitting...
    </button>
  ) : (
    <button className="btn btn-primary" onClick={submitFormHandler}>
      Register
    </button>
  )}
</form>

    </>
  );
};

export default RegisterPage;
