import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
 import 'aos/dist/aos.css';

const TestimonialData = [
    {
        id: 1,
        name: "Akhtar Ullah",
        text: "Creating my shop on this platform has been a game-changer. Not only can I sell my custom-tailored suits directly to customers, but the integrated tailoring service requests have streamlined my business operations. My customer base has grown significantly!",
        img: "https://picsum.photos/101/101",
    },

    {
        id: 2,
        name: "Ahmad Hassan",
        text: "As a small business owner, finding an all-in-one platform like this has been incredible. The ease of setting up my shop and managing both product sales and tailoring services has saved me so much time. The support team is also fantastic, always ready to help!",
        img: "https://picsum.photos/102/102",
    },

    {
        id: 3,
        name: "Shawaiz Hassan",
        text: "This platform has made it easy for me to showcase my work and reach a wider audience. The ability to handle tailoring service requests directly through the shop interface has improved my workflow tremendously. Highly recommend it to other shop owners! ",
        img: "https://picsum.photos/103/103",
    },

    {
        id: 4,
        name: "Owais Channa",
        text: "The user-friendly interface made setting up my shop a breeze. I love how I can manage both product listings and tailoring service requests from one place. My customers appreciate the seamless experience, and so do I. Great job!",
        img: "https://picsum.photos/104/104",
    },

    {
        id: 5,
        name: "Hanzla Saleem",
        text: "What sets this platform apart is its versatility. I can sell ready-made clothes and offer custom tailoring services without juggling multiple systems. The sales have been fantastic, and my tailor services are booked more than ever. Kudos to the team for this brilliant solution!",
        img: "https://picsum.photos/105/105",
    },

];

const Testimonials = () => {

    var settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        // slider show : 2, 
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
  return (
    <div className='py-10 mb-10'>
      <div className='container'>
        {/* header section */}

        <div className='text-center mb-10 max-w-[600px] mx-auto'>
            <p className='text-sm text-primary'>What our Customers are Saying</p>
            <h1 data-aos="fade-up" className='text-3xl font-bold'>Testimonials</h1>
            <p className='text-xs text-gray-400'> Here are some testimonials of shop owners can create their shops, sell products, and offer tailoring services:</p>
        </div>
            {/* Testimonials cards */}
            <div data-aos='zoom-in'>
            <Slider {...settings} >
                {
                    TestimonialData.map((data) => (
                        <div className='my-6'>
                     <div 
                     key={data.id}
                     className='flex flex-col gap-4 shadow-lg
                     py-8 px-6 mx-4 rounded-xl dark:bg-gray-800
                     bg-primary/10 relative'
                     >
                        <div className='mb-4'>
                            <img src={data.img} alt="" 
                            className='rounded-full w-20 h-20'
                            />
                        </div>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='space-y-3'>
                            <p className='text-xs text-gray-400'> {data.text} </p>
                            <h1 className='text-xl font-bold text-block/80 dark:text-light'> {data.name} </h1>
                            </div>
                        </div>
                        <p className='text-black/20 text-9xl font-serif absolute top-0 right-0'>
                        ,,
                        </p>
                     </div>
                     </div>
                    ))}
            </Slider>
            </div>
      </div>
    </div>
  )
}

export default Testimonials
