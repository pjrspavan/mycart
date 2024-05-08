import { useState, useEffect } from "react";

const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const totalProducts = await response.json();
          setProducts(totalProducts.products);
        } else {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {};
  }, []); // Empty dependency array to execute the effect only once
  return { loading, products, error };
};
export default useFetchData;
