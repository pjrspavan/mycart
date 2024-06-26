import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import useFetchData from "./useFetchData";

function OrderComponent() {
  const [orders, setOrders] = useState([]);
  const { loading, products } = useFetchData();

  useEffect(() => {
    fetchOrders();
  }, [products]);

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
        console.log(ordersArr);
        if (ordersArr.length > 0) {
          let prods = [];
          let prodIdMap = new Map();
          let statusMap = new Map();
          for (let i of ordersArr) {
            prods.push(i.item_id + "");
            prodIdMap.set(i.item_id, i.quantity);
            statusMap.set(i.item_id, i.status);
          }
          fetchProduct(prods, prodIdMap, statusMap);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProduct(prods, prodIdMap, statusMap) {
    let updatedOrders = [];
    for (let i of products) {
      if (prods.includes(i.id + "")) {
        updatedOrders.push({
          ...i,
          quantity: prodIdMap.get(i.id),
          price: i.price * prodIdMap.get(i.id),
          status: statusMap.get(i.id),
        });
      }
    }
    setOrders(updatedOrders);
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
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg relative py-2"
            >
              <Link
                to={`/product/${order.id}`}
                className="block absolute top-0 right-0 m-4 text-blue-500 font-semibold text-sm"
              >
                View Product
              </Link>
              <div className="flex flex-col md:flex-row">
                <img
                  src={order.images[0]}
                  alt={order.title}
                  className="w-full md:w-1/3 h-auto md:h-48 object-contain"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-lg font-semibold mb-2 text-gray-800">
                      {order.title}
                    </p>
                    <p className="text-gray-700 mb-2">${order.price}</p>
                    <p className="text-gray-700">Quantity: {order.quantity}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700">Order Status:</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-1/2">
                        <div className="h-2 bg-gray-300 rounded-full">
                          <div className="h-full bg-indigo-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{order.status}</p>
                    </div>
                  </div>
                </div>
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

export default OrderComponent;
