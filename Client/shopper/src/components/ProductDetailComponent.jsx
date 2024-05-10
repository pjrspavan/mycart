import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductDetailComponent() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const { productId } = useParams();
  const [message, setMessage] = useState("Add to Cart");
  const loggedUser = localStorage.getItem("loggedEmail");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Error fetching product:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleCheckout = (e) => {
    if (loggedUser) {
      addToCart();
      navigate("/cart");
    } else {
      navigate(`/login/${productId}`);
    }
  };
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const addToCart = async () => {
    if (loggedUser) {
      try {
        const body = {
          product_id: productId,
          quantity: quantity,
          price: product.price,
          user_id: loggedUser,
        };
        const response = await fetch("http://localhost:8000/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        });
        if (response.ok) {
          setMessage("Added to cart");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/login/${productId}/${quantity}`);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    product && (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 p-6">
          Product Specification
        </h2>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="flex justify-center">
              <div className="w-3/4">
                {product.images.length > 1 ? (
                  <Slider {...settings}>
                    {product.images.map((image, idx) => (
                      <div key={idx}>
                        <img
                          src={image}
                          alt={`${idx + 1}`}
                          className="w-full max-h-96 object-contain"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={`${0}`}
                    className="w-full max-h-96 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col p">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center mb-2">
              <label className="mr-2">Price:</label>
              <p className="text-gray-700">${product.price}</p>
            </div>
            <div className="flex items-center mb-2">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex">
              <button
                onClick={addToCart}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
              >
                {message}
              </button>
              <button
                onClick={handleCheckout}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProductDetailComponent;
