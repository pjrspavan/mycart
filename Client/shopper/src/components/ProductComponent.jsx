import React from "react";
import { Link } from "react-router-dom";

function ProductComponent(props) {
  const product = props.product;

  return (
    <Link
      to={`/product/${product.id}`}
      className="block w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full p-5 transition duration-300 ease-in-out transform hover:shadow-xl">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">${product.price}</p>
            <p className="text-gray-700 line-clamp-3">{product.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductComponent;
