import React, { useEffect, useState } from "react";
import useFetchData from "./useFetchData";

export default function MyCartComponent() {
  const [cart, setCart] = useState([]);
  const user_id = localStorage.getItem("loggedEmail");
  const { loading, products, error } = useFetchData();
  useEffect(() => {
    fetchMyCartItems();
  }, [products]);

  const handleCheckout = async () => {
    console.log("ere");
    let price = 0;
    cart.forEach((item) => {
      price += item.price * item.quantity;
    });
    const orderData = {
      user_id: user_id,
      price: price,
      cartItems: cart,
    };
    try {
      console.log("ere");
      const response = await fetch("http://localhost:8000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
      });
      if (response.ok) {
        console.log("Items ordered successfully");
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Cart</h1>
      {cart.length > 0 ? (
        <table className="w-full border-collapse border border-gray-100">
          <thead>
            <tr className="">
              <th colSpan="2" className="border border-gray-100 p-2">
                Product
              </th>
              <th className="border border-gray-100 p-2">Price</th>
              <th className="border border-gray-100 p-2">Quantity</th>
              <th className="border border-gray-100 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-100 p-2">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-auto"
                  />
                </td>
                <td className="border border-gray-100 p-2">{item.title}</td>
                <td className="border border-gray-100 p-2">${item.price}</td>
                <td className="border border-gray-100 p-2">{item.quantity}</td>
                <td>
                  <button className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your Cart is Empty</p>
      )}
      {cart.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
