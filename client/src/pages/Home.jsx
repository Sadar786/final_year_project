// Home.jsx
import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Products from '../components/Products/Products'
import Banner from '../components/Banner/Banner'
import TopProducts from '../components/TopProducts/TopProducts'
import Subscribe from '../components/Subscribe/Subscribe'
import Testimonials from '../components/Testimonials/Testimonials'

const Home = () => {

  return (
    <>
        <Hero/>
       <div  className='bg-white mx-8 dark:bg-gray-900 dark:text-white duration-200'>
       <Products />

      {/* <Testimonials /> */}
       <TopProducts />
      <Banner />
      <Subscribe />
       <Testimonials/>
    </div>
    </>
  );
};

export default Home;

