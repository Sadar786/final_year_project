import React, { useEffect, useState } from 'react';
import { FaStar, FaCartPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';




const SalePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedToCart, setAddedToCart] = useState({});
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {

    const fetchProducts = async () => {
      setLoading(true);
      const categoryParam = selectedCategory === 'All' ? '' : `&category=${selectedCategory}`;
      const res = await fetch(`/api/product/getProducts?onSale=true${categoryParam}`);
            if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
        if (data.products.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchProducts();
  }, [selectedCategory])


  const handleButtonClick = (id) => {
    setAddedToCart((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };


  const handleOrderNow = (product) => {
    navigate("/addorder", { state: { products: product } });
  };

  const renderProducts = (category) => {
    return products.filter((product) => category === 'All' || product.category === category)
      .map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-2 w-72 overflow-hidden relative transition duration-700 transform hover:scale-105"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md mb-4 cursor-pointer"
          />
          <div
            className={`absolute inset-0 bg-black opacity-0 hover:opacity-10 transition duration-300 ${
              addedToCart[product.id] ? 'bg-primary' : ''
            }`}
          ></div>
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{product.price}</p>
          <div className="flex items-center mb-2">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{product.rating}</span>
          </div>
          <button
            className='text-center  cursor-pointer
            bg-primary text-white py-1 px-2 rounded-full transition
            transform duration-300 hover:bg-primary-dark hover:text-black hover:scale-105'
            
            onClick={()=>handleOrderNow(product)}
          >
            Order Now
          </button>
        </div>
      ));
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 mx-2 rounded-full ${selectedCategory === 'All' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-full ${selectedCategory === 'kids' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setSelectedCategory('kids')}
          >
            Kids
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-full ${selectedCategory === 'women' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setSelectedCategory('women')}
          >
            Women
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-full ${selectedCategory === 'men' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setSelectedCategory('men')}
          >
            Men
          </button>
        </div>
        <div className="flex flex-wrap justify-center">
          {renderProducts(selectedCategory)}
        </div>
      </div>
     </div>
  );
};

export default SalePage;
