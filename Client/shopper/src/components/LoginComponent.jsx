import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../images/logo.png";

function LoginComponent() {
  const params = useParams();
  const [message, setMessage] = useState();
  useEffect(() => {
    if (params.product && params.quantity) {
      setMessage("Please login to add items to cart");
    } else if (params.product) {
      setMessage("Please login to checkout");
    }
  }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState();
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
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const responseData = await response.json();
      if (response.ok) {
        setErr("");
        console.log(responseData);
        localStorage.setItem("loggedEmail", responseData.data.email);
        localStorage.setItem("firstName", responseData.data.firstName);
        localStorage.setItem("lastName", responseData.data.lastName);
        navigate("/");
      } else if (response.status === 401) {
        setErr(responseData.error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="flex flex-1 flex-col justify-center px-4  sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      {message && <span>{message}</span>}
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="flex justify-center items-center">
          <img width="200" height="240" src={logo} alt="My Cart Logo" />
        </div>
        <div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Not a member?
            <Link
              to={"/signup"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create a new account
            </Link>
          </p>
        </div>

        <div className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {err && <span>{err}</span>}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm leading-6 text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginComponent;
