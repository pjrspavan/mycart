import React from "react";
import ProductComponent from "./ProductComponent";
import useFetchData from "./useFetchData";

function HomeComponent() {
  const { loading, products, error } = useFetchData();
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">All Items</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductComponent key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomeComponent;
