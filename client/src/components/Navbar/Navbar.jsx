import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";
import DarkMode from "../DarkMode";
import { toggleTheme } from "../../redex/theme/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Avatar } from "flowbite-react";
import { signOutSuccess } from "../../redex/user/userSlice.js";
import { signOutDone } from "../../redex/shop/shopSlice.js";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Women Wear", link: "/womenwear" },
  { id: 3, name: "Kids Wear", link: "/kidswear" },
  { id: 4, name: "Men Wear", link: "/menwear" },
  { id: 5, name: "Sale", link: "/sale" },
  { id: 6, name: "Shops", link: "/searchshops" },
  { id: 7, name: "About", link: "/about" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { myShop } = useSelector((state) => state.shop);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutSuccess());
        dispatch(signOutDone());
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    if (window.location.pathname === "/searchshops") {
      navigate(`/searchshops?${searchQuery}`);
    } else {
      navigate(`/search?${searchQuery}`);
    }
  };

  return (
    <div className="shadow-md bg-white py-1 dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="bg-primary/40  py-1">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Left side: Logo */}
          <div className="  hidden sm:inline items-center gap-2">
            <div
              // to={`/shop/${myShop.slug}`}
              className="self-center   whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              {/* shop logo */}
              {currentUser && currentUser.haveAShop && (
                <div className="flex justify-center items-center">
                  <img
                    className="w-10 rounded-full mr-1"
                    src={myShop && myShop.image}
                    alt=""
                  />
                  <span className="text-xs">{myShop ? myShop.title : ""}</span>
                </div>
              )}
            </div>
          </div>
          {/* Right side: search bar, order button, dark mode switch */}
          <div className="flex items-center gap-2">
            {/* search bar */}
            <div className="relative group hidden sm:block">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[200px] sm:w-[200px] group-hover:w-[300px]
                  transition-all duration-300 rounded-full border
                  border-gray-300 px-2 py-1 focus:outline-none focus:border-1
                  focus:border-primary
                  dark:border-gray-500
                  dark:bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer" />
            </div>
            {/* order button */}
            <div className="flex gap-2 md:order-2">
              {currentUser ? (
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar
                      alt="user"
                      img={currentUser.profilePicture}
                      rounded
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">
                      @{currentUser.username}
                    </span>
                    <span className="block text-sm font-medium truncate">
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Link to={"/dashboard?tab=profile"}>
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignout}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              ) : (
                <Link to="/signin">
                  <Button gradientDuoTone="purpleToBlue" outline>
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            {/* Darkmode Switch */}
            <div onClick={() => dispatch(toggleTheme())}>
              <DarkMode />
            </div>
          </div>
          {/* Hamburger Icon */}
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-3xl">
              ☰
            </button>
          </div>
        </div>
      </div>
      {/* lower Navbar */}
      <div className={`sm:flex ${isOpen ? "block" : "hidden"} justify-center`}>
        <ul className="flex flex-col sm:flex-row items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
                {data.name}
              </Link>
            </li>
          ))}
          {/* Simple DropDown and Links */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
