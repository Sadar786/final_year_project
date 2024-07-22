import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function NewCard({ products }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  if (!products) {
    console.log("Products is not being passed correctly or not present");
    return null; // Return null if products is undefined
  }

  const handleOrderNow = (product) => {
    if (!currentUser) {
      alert("You need to sign in or sign up first  (from card)");
      navigate("/signin");
      return;
    }
    navigate("/addorder", { state: { products: product } });
  };

  return (
    <div className="flex">
      <div
        data-aos="fade-up"
        data-aos-delay={products.asoDelay}
        key={products._id}
        className="space-y-3"
      >
        <img
          src={products.image}
          alt=""
          className="h-[220px] w-[150px] object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold">{products.name}</h3>
          <p className="text-sm text-gray-600"> {products.color} </p>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span>4.7</span>
          </div>
        </div>
        <div className="">
          <button
            onClick={() => handleOrderNow(products)}
            className="text-center cursor-pointer bg-primary text-white py-1 px-2 rounded-full transition transform duration-300 hover:bg-primary-dark hover:text-black hover:scale-105"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
