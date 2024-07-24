import React, { useState, useEffect } from "react";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/shopping.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrderNow = (product) => {
    navigate("/addorder", { state: { products: product } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/product/getProducts`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        const filteredProducts = data.products.filter(
          (product) => product.discount > 0
        );
        setProducts(filteredProducts);
        setLoading(false);
      } else {
        //  setShowMore(false);
      }
    };
    fetchProducts();
  }, []);

  let taxGov = 0;

  return (
    <div
      className="relative overflow-hidden min-h-[500px] sm:min-h-[650px]
                 bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white
                duration-200"
    >
      {/* background pattern */}
      <div
        className=" h-[700px] w-[700px] bg-primary/40 absolute 
                -top-1/2 right-0 rounded-3xl rotate-45 -z-9 "
      ></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {products.map((data) => (
            <div key={data._id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div
                  className="flex flex-col justify-center gap-4 pt-12 sm:pt-0
                text-center sm:text-left order-2 sm:order-1 relative z-10"
                >
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {/* {data.discount}% off on {' '} {data.name} */}
                    Govern tax {
                      (taxGov = parseInt((10 / 100) * data.price))
                    }{" "}
                    Total price {parseInt(data.price + taxGov)}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <button
                      onClick={() => handleOrderNow(data)}
                      className="bg-gradient-to-r from-primary to-secondary
                    hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.image}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px]
                    sm:scale-120 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
