import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

function HeaderComponent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchClick = () => {
    if (searchQuery === "") navigate("/products");
    else navigate(`/products?search=${searchQuery}`);
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
        localStorage.removeItem("loggedEmail");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isLoggedIn = localStorage.getItem("loggedEmail");
  return (
    <header className="bg-indigo-300 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-2">
        <span>
          <Link to={"/"}>
            <img src={logo} alt="My Cart Logo" className="h-10" />
          </Link>
        </span>
        <div className="flex justify-center items-center mb-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-48 sm:w-64 px-3 py-2 border border-gray-300 placeholder:text-gray-400 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-600"
          />
          <button
            onClick={handleSearchClick}
            className="px-2 sm:px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none text-sm"
          >
            Search
          </button>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to={"/cart"} className="hover:text-gray-300">
              <span className="[&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
              </span>
            </Link>
          </li>
          {!isLoggedIn && (
            <li>
              <Link to={"/login"} className="hover:text-gray-300">
                Login
              </Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to={"/signup"} className="hover:text-gray-300">
                SignUp
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to={"/orders"} className="hover:text-gray-300">
                  My Orders
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout} className="hover:text-gray-300">
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default HeaderComponent;
