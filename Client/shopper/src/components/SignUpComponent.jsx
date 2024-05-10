import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

function SignUpComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    mobile: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState();
  const [success, setSuccess] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (response.ok) {
        setErr("");
        setSuccess("Account created");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (response.status === 400) {
        setErr(responseData.error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="flex min-h-full flex-col justify-center px-6  lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center items-center">
          <img width="200" height="240" src={logo} alt="My Cart Logo" />
        </div>

        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {success}
            </div>
          )}
          {err && <span>{err}</span>}
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Last Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Mobile
            </label>
            <div className="mt-1">
              <input
                type="mobile"
                name="mobile"
                value={formData.mobile}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter Password
              </label>
            </div>
            <div className="mt-1">
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign Up
            </button>
          </div>
          <div>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Already a member?
              <Link
                to={"/login"}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SignUpComponent;
