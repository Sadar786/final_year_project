import React, { useState , useEffect} from 'react'
import Hero from '../components/Hero/Hero'
import NewCard from '../component/NewCard'

export default function menWear() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]= useState(false)
  const [showMore, setShowMore] = useState(false);
  



  useEffect(()=> {

    const fetchProducts = async () => {
      setLoading(true);
       const res = await fetch(`/api/product/getProducts?category=men`);
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
  }, [])

  const handleShowMore = async () => {
    console.log("show more");
    const startIndex = products.length;

    try {
      const res = await fetch(
        `/api/product/getProducts/?startIndex=${startIndex}&category=men&limit=5`
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






  return (
    <div >
        <Hero/> 
        <div className='mt-16 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 mb-10 place-items-center gap-5'>
        {
          products.map((product) => {

          return  <NewCard key={products._id} products={product}/>

          

          })
        }     
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
    </div>
  )
}
