import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetchData from "./useFetchData";
import cartLogo from "../images/emptycart.svg";
import removeCart from "../images/removecart.png";

export default function MyCartComponent() {
  const [cart, setCart] = useState([]);
  const user_id = localStorage.getItem("loggedEmail");
  const first_name = localStorage.getItem("firstName");
  const last_name = localStorage.getItem("lastName");
  const { loading, products } = useFetchData();
  const [message, setMessage] = useState();
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    fetchMyCartItems();
  }, [products]);
  const handleCheckout = async () => {
    const orderData = {
      user_id: user_id,
      price: totalPrice,
      cartItems: cart,
    };
    try {
      const response = await fetch("http://localhost:8000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Item(s) ordered successfully");
        fetchMyCartItems();
      } else {
        console.error("Failed to order items");
      }
    } catch (error) {
      console.error("Error while processing order:", error);
    }
  };

  const fetchMyCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        let price = 0;
        data.forEach((item) => {
          price += item.price * item.quantity;
        });
        setTotalPrice(price);
        const prods = data.map((item) => ({
          id: item.product_id,
          quantity: item.quantity,
        }));

        const prodIds = prods.map((item) => item.id);

        const productsWithQuantity = products
          .filter((product) => prodIds.includes(product.id))
          .map((product) => ({
            ...product,
            quantity: prods.find((item) => item.id === product.id).quantity,
          }));

        setCart(productsWithQuantity);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error while fetching cart items:", error);
    }
  };

  const cartQuantityHandler = async (item, operation) => {
    let quantity = item.quantity;
    if (operation === "+") quantity += 1;
    else if (operation === "-") quantity -= 1;
    else quantity = 0;
    const response = await fetch(`http://localhost:8000/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id,
        id: item.id,
        quantity: quantity,
        cart: cart,
      }),
      credentials: "include",
    });
    if (response.ok) {
      console.log("Success!");
      fetchMyCartItems();
    }
  };

  return (
    <div className="px-2 py-2">
      <p className="py-5 text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
        Your Cart
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <svg
            className="animate-spin h-16 w-16 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014.01 4.582M22 12h-4a8.001 8.001 0 01-7.97 7.999 7.992 7.992 0 01-5.657-2.343"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {cart.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="absolute top-1/2 transform -translate-y-1/2">
                <img
                  src={cartLogo}
                  alt="logo"
                  className="mx-auto h-32 w-auto"
                />
              </div>
            </div>
          ) : (
            <div className="py-8 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto bg-white border border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="bg-indigo-400 text-white px-2 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              </div>
              <div className="mt-6 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                  <div className="flex flex-col justify-start items-start bg-white px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full border border-gray-200">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full border-b border-gray-200"
                      >
                        <div className="pb-4 md:pb-8 w-full md:w-40">
                          <img
                            className="w-32 h-20 hidden md:block object-contain"
                            src={item.images[0]}
                            alt={item.title}
                          />
                        </div>
                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-2 md:space-y-0">
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-xl  xl:text-2xl font-semibold leading-6 text-gray-600">
                              {item.title}
                            </h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              <p className="text-sm leading-none text-gray-600">
                                <span className=" text-gray-600">
                                  Quantity:
                                </span>
                                {item.quantity}
                              </p>
                              <p className="text-sm leading-none text-gray-600">
                                <span className="text-gray-600">Price:</span>$
                                {item.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-start items-start flex-col space-y-2">
                            <div className="flex items-center pt-2">
                              <button
                                onClick={() => cartQuantityHandler(item, 0)}
                                className=" px-4 py-1 rounded-md  focus:outline-none"
                              >
                                <img
                                  src={removeCart}
                                  alt="remove"
                                  className="h-10"
                                  title="Remove from cart"
                                />
                              </button>
                            </div>
                            <div className="flex items-center mt-2">
                              <button
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l focus:outline-none"
                                onClick={() => cartQuantityHandler(item, "-")}
                              >
                                -
                              </button>
                              <span className="px-2">{item.quantity}</span>
                              <button
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r focus:outline-none"
                                onClick={() => cartQuantityHandler(item, "+")}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                    <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-white border border-gray-200 space-y-6">
                      <h3 className="text-xl  font-semibold leading-5 text-gray-800">
                        Summary
                      </h3>
                      <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                        <div className="flex justify-between w-full">
                          <p className="text-base leading-4 text-gray-800">
                            Subtotal
                          </p>
                          <p className="text-base  leading-4 text-gray-600">
                            ${totalPrice}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base  leading-4 text-gray-600">
                            Shipping
                          </p>
                          <p className="text-base  leading-4 text-gray-600">
                            $8.00
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base  font-semibold leading-4 text-gray-600">
                          Total
                        </p>
                        <p className="text-base font-semibold leading-4 text-gray-600">
                          ${totalPrice + 8}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-white border border-gray-200 space-y-6">
                      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-600">
                        Shipping
                      </h3>
                      <div className="flex justify-between items-start w-full">
                        <div className="flex justify-center items-center space-x-4">
                          <div className="w-8 h-8">
                            <img
                              className="w-full h-full"
                              alt="logo"
                              src="https://i.ibb.co/L8KSdNQ/image-3.png"
                            />
                          </div>
                          <div className="flex flex-col justify-start items-center">
                            <p className="text-lg leading-6  font-semibold text-gray-600">
                              Delivery
                              <br />
                              <span className="font-normal">
                                Delivery with 24 Hours
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col border border-gray-200">
                  <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                    <div className="flex flex-col justify-start items-start flex-shrink-0">
                      <div className="flex justify-start items-start flex-col space-y-2">
                        <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                          {first_name}&nbsp; {last_name}
                        </p>
                        <p className="text-sm leading-5 text-gray-600 underline">
                          <Link to="/orders">Previous Orders</Link>
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                      <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                            Shipping Address
                          </p>
                          <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                            180 North King Street, Northhampton MA 1060
                          </p>
                        </div>
                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-center md:text-left text-gray-800">
                            Billing Address
                          </p>
                          <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                            180 North King Street, Northhampton MA 1060
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
