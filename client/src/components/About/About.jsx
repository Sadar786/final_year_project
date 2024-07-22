import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SadarImage from '../../assets/website/sadar.png';
import AhmadImage from '../../assets/website/ahmad.jpg';
import ShawaizaImage from '../../assets/website/shawaiz.jpg';
import Footer from '../Footer/Footer';
import Testimonials from '../Testimonials/Testimonials';
import Products from '../Products/Products';

const About = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  React.useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);


  const handleSubscribe = () => {
    setSubscribed(true)
    // Here you can implement your subscription logic, e.g., sending a request to your backend
    // For simplicity, just simulate success after 1 second
    setTimeout(() => {
      setSubscribed(false);
      // Clear the email input after successful subscription
      setEmail('');

    }, 1000);
  };

  return (
    <div className="bg-gray-100  dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We are a dedicated team committed to providing the best service possible.
          </p>
        </div>

        {/* Our Mission Section */}
        <div className="mb-12 flex items-center justify-center flex-col w-full" data-aos="fade-right">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our mission is to deliver quality products and exceptional service to our customers.
          </p>
        </div>

        {/* Our Vision Section */}
        <div className="mb-12 flex items-center justify-center flex-col w-full" data-aos="fade-right">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            To innovate and lead in our industry, constantly improving and evolving to meet our customers' needs.
          </p>
        </div>

        {/* Our Team Section */}
        <div className="mb-12 flex items-center justify-center flex-col w-full" data-aos="fade-left">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <img src={SadarImage} alt="Team Member" className="w-full h-96 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-bold mb-2">Sadar Ullah</h3>
                <p className="text-gray-700 dark:text-gray-300">CEO & Founder</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <img src={AhmadImage} alt="Team Member" className="w-full h-96 rounded-md mb-4" />
                <h3 className="text-xl font-bold mb-2">Ahmad Hassan</h3>
                <p className="text-gray-700 dark:text-gray-300">CTO</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <img src={ShawaizaImage} alt="Team Member" className="w-full h-96 rounded-md mb-4" />
                <h3 className="text-xl font-bold mb-2">Shawaiz Hassan</h3>
                <p className="text-gray-700 dark:text-gray-300">Marketing Head</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-12 flex items-center justify-center flex-col w-full" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="flex items-center text-lg text-gray-700 dark:text-gray-300">
              <FaCheckCircle className="text-green-500 mr-2" />
              Integrity and honesty in all our dealings
            </li>
            <li className="flex items-center text-lg text-gray-700 dark:text-gray-300">
              <FaCheckCircle className="text-green-500 mr-2" />
              Customer-centric approach
            </li>
            <li className="flex items-center text-lg text-gray-700 dark:text-gray-300">
              <FaCheckCircle className="text-green-500 mr-2" />
              Commitment to quality and excellence
            </li>
          </ul>
        </div>

        {/* Our Goals Section */}
        <div className="mb-12 flex items-center justify-center flex-col w-full" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-4">Our Goals</h2>
          <ul className="space-y-4">
            <li className="text-lg text-gray-700 dark:text-gray-300">
              Innovate and lead in our industry
            </li>
            <li className="text-lg text-gray-700 dark:text-gray-300">
              Expand our market reach globally
            </li>
            <li className="text-lg text-gray-700 dark:text-gray-300">
              Foster a culture of continuous improvement
            </li>
          </ul>
        </div>

       
        {/* Subscription Section */}
        <div className="mb-12" data-aos="fade-up">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
            {!subscribed && (
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <input
                  type="email"
                  className="w-full py-3 px-4 rounded-lg text-slate-800 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </button>
              </div>
            )}
            {subscribed && (
              <p className="mt-4 text-green-500">
                Successfully subscribed! Thanks for subscribing.
              </p>
            )}
          </div>
        </div>
      </div>
     </div>
  );
};

export default About;
