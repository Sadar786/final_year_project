import React from 'react';
import footerLogo from '../../assets/logo.png';
import Banner from '../../assets/website/footer-pattern.jpg';
import { FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow, FaMobileAlt } from 'react-icons/fa';

const BannerImg = {
    backgroundImage: `url(${Banner})`,
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
};

const FooterLinks = [
    {
        title: 'Home',
        link: '/#',
    },
    {
        title: 'About',
        link: '/about',
    },
    {
        title: 'Shops',
        link: '/searchshops',
    },
    {
        title: 'Sale',
        link: '/sale',
    },
];

const Footer = () => {
    return (
        <div style={BannerImg} className="text-white">
            <div className="container mx-auto px-4">
                <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5">
                    {/* Company Details */}
                    <div className="py-8 px-4">
                        <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
                            <a href="#" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                                <img src={footerLogo} alt="Shopsy" className="max-w-[50px]" />
                                <span>Fuel Fashion</span>
                            </a>
                        </h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, tempore molestias. Amet dicta nihil architecto?</p>
                    </div>
                    {/* Footer Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                        <div className="py-8 px-4">
                            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3">Quick Links</h1>
                            <ul className="flex flex-col gap-3">
                                {FooterLinks.map((link) => (
                                    <li className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200" key={link.title}>
                                        <a href={link.link}>{link.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Social Links */}
                        <div className="py-8 px-4">
                            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3">Follow Us</h1>
                            <div className="flex items-center gap-3 mt-6">
                                <a href="#">
                                    <FaInstagram className="text-3xl hover:text-pink-600 transition-colors duration-300" />
                                </a>
                                <a href="#">
                                    <FaFacebook className="text-3xl hover:text-blue-600 transition-colors duration-300" />
                                </a>
                                <a href="#">
                                    <FaLinkedin className="text-3xl hover:text-blue-700 transition-colors duration-300" />
                                </a>
                            </div>
                            <div className="mt-6">
                                <div className="flex items-center gap-3 mt-3">
                                    <FaLocationArrow />
                                    <p>Islamabad, Pakistan</p>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <FaMobileAlt />
                                    <p>+923454847473</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
