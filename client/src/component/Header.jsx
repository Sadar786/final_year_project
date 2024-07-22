import React, { useEffect, useState } from "react";
import { Navbar, TextInput, Button , Dropdown, Avatar, theme} from "flowbite-react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import {useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from "../redex/theme/ThemeSlice";
import { signOutSuccess } from "../redex/user/userSlice";
//import Logo from '../assets/logo.png'
import HeaderUpper from './headerUpper/HeaderUpper.jsx'
import { signOutDone  } from "../redex/shop/shopSlice.js";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const {myShop} = useSelector((state)=> state.shop)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutSuccess());
        dispatch(signOutDone())
        localStorage.clear();
                
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
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

   return (
    <Navbar className='border-b-2 '>
      <HeaderUpper/>
      
        {currentUser && currentUser.haveAShop && (

      <div className="flex sm:inline justify-center items-center">
        <Link to={`/shop/${myShop.slug}`}>
        <img className="w-14 rounded-full mr-1" src={myShop && myShop.image} alt="" />
        </Link>
        <Link to={`/shop/${myShop?.slug}`}>
        
        <span className="text-xs">{myShop ? myShop.title : ""}</span>
        </Link>
      </div>
       )}
       <form onSubmit={handleSubmit}
      >
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
           onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
       {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )} 
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
         
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/newarrival'>New Arrival</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/sale'>SALE</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/about'>about</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
