import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import NewCard from "../../component/NewCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(false);

  const handleOrderNow = () => {
    navigate("/addorder", { state: { products } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/getProducts?limit=10`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
        setShowMore(data.products.length === 10);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShowMore = async () => {
    console.log("show more");
    const startIndex = products.length;

    try {
      const res = await fetch(
        `/api/product/getProducts/?startIndex=${startIndex}&limit=5`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setShowMore(data.products.length === 5);
    } catch (error) {
      setError(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load products.</div>;
  }

  return (
    <>
    
    <div
      className="mt-16 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 place-items-center gap-5"
    >
      {products.map((product) => (
        <NewCard key={product._id} products={product} />
      ))}
     
    </div>

    {showMore && (
        <div className="flex my-10 mx-auto md:my-16 items-center w-full justify-center">
          <button
            onClick={handleShowMore}
            className="text-center mt-10 cursor-pointer
        bg-primary text-white py-1 px-5 rounded-md transition
        transform duration-300 hover:bg-primary-dark hover:text-black hover:scale-105"
          >
            show more
          </button>
        </div>
      )}
    </>
  );
};

export default Products;
