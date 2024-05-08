import React, { useEffect, useState } from "react";
import "../App.css";

function OrderComponent() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

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

        if (ordersArr.length > 0) {
          let prods = [];
          let prodIdMap = new Map();
          for (let i of ordersArr) {
            prods.push(i.item_id + "");
            prodIdMap.set(i.item_id, i.quantity);
          }

          fetchProduct(prods, prodIdMap);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProduct(prods, prodIdMap) {
    try {
      const response = await fetch(`https://dummyjson.com/products`);
      if (response.ok) {
        const data = await response.json();
        for (let i of data.products) {
          if (prods.includes(i.id + ""))
            setOrders([...orders, { ...i, quantity: prodIdMap.get(i.id) }]);
        }
        console.log("orders", orders);
      } else {
        console.error("Error fetching product:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>
      {orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-100">
          <thead>
            <tr className="">
              <th colSpan="2" className="border border-gray-100 p-2">
                Product
              </th>
              <th className="border border-gray-100 p-2">Price</th>
              <th className="border border-gray-100 p-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td colSpan={2} className="border border-gray-100 p-2">
                  <img
                    src={order.images[0]}
                    alt={order.title}
                    className="w-20 h-20"
                  />
                  <p className="text-lg font-semibold">{order.title}</p>
                </td>
                <td className="border border-gray-100 p-2">
                  <p className="text-gray-700">${order.price}</p>
                </td>
                <td className="border border-gray-100 p-2">
                  <p className="text-gray-700">{order.quantity}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default OrderComponent;
