import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import useFetchData from "./useFetchData";

function TestComponent() {
  const [orders, setOrders] = useState([]);
  const { loading, products } = useFetchData();

  useEffect(() => {});
  if (!loading) {
    fetchOrders();
  }

  async function fetchOrders() {
    try {
      const response = await fetch(
        `http://localhost:8000/orders/${localStorage.getItem("loggedEmail")}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const ordersArr = await response.json();
        for (let order of ordersArr) {
          order.order_items = order.order_items.map((orderItem) => {
            const product = products.find((product) => {
              return product.id === orderItem.item_id;
            });
            if (product) {
              return {
                ...orderItem,
                description: product.description,
                title: product.title,
                images: product.images,
              };
            } else {
              return orderItem;
            }
          });
        }
        console.log(ordersArr);
        setOrders(ordersArr);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
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
      ) : orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg relative py-2 mb-6"
            >
              <Link
                to={`/product`}
                className="block absolute top-0 right-0 m-4 text-blue-500 font-semibold text-sm"
              >
                View Product
              </Link>
              <div className="flex flex-col md:flex-row">
                <div className="p-4 flex-1">
                  <div>
                    <p className="text-lg font-semibold mb-2 text-gray-800">
                      {order.order_id}
                    </p>
                    <p className="text-gray-700 mb-2">${order.price}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700">Order Status:</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-1/2">
                        <div className="h-2 bg-gray-300 rounded-full">
                          <div className="h-full bg-indigo-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700"></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {order.order_items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center space-x-2 border p-2"
                  >
                    <div>
                      <p className="text-gray-800">{item.title}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-800">No orders found.</p>
      )}
    </div>
  );
}

export default TestComponent;
