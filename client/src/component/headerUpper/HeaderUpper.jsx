import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdSearch ,} from "react-icons/io";
 
export default function Navbar() {
  const { myShop, signInSatus } = useSelector((state) => state.shop);
  const {currentUser } = useSelector((state)=> state.user)
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
 
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    if (window.location.pathname === "/searchshops") {
      navigate(`/searchshops?${searchQuery}`);
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate(`/search?${searchQuery}`);
      window.scrollTo({ top: 150, behavior: "smooth" })
    }
  };

 const goToDash = () => {
  if(currentUser.isAdmin === true){
    navigate(`/dashboard?tab=dashboardComp`)
  }
  if(currentUser.haveAShop){
    navigate(`/dashboard?tab=shopownerdash`)
  }
 }
  return (
    <div className="flex py-1 sm:py-0  w-full text-gray-100 px-2  bg-black  ">
      <div className="flex justify-between items-center  w-full">
        <div className=" hidden sm:block">
          <img className="w-8" src={Logo} alt="Logo" />
        </div>
        {/* search bar */}
        <div className="relative text-black dark:text-white group block sm:hidden">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[100px] sm:w-[100px] group-hover:w-[150px]
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
        <div className="center_content-uper sm:inline hidden">
          <h3>Clothing and Customized Tailoring Platform</h3>
        </div>
        <div className="right_content-uper">
          {signInSatus && currentUser && (currentUser.haveAShop || currentUser.isAdmin )? (
         //   <Link to="/dashboard?tab=dashboardComp" className="displayNone">
                <button
                onClick={() => goToDash()}
                 className='text-center cursor-pointer
                bg-yellow-500 text-white py-1 px-5 rounded-md transition
                transform duration-300 hover:bg-primary-dark hover:text-black hover:scale-105'>
                  Dashboard
                </button>
         //   </Link>
          ) : (
            <Link to="create-shop">
               <button className='text-center   cursor-pointer
              bg-yellow-500 text-white py-1 px-5 rounded-md transition
                transform duration-300 hover:bg-primary-dark hover:text-black hover:scale-105'>
                  Create Store
                </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
