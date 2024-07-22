import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
 import PrivateRoute from "./component/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer/Footer";
import OnlyAdminPrivateRoute from './component/OnlyAdminPrivateRoute';
import CreateShop from "./pages/CreateShop";
import ShopPage from "./pages/ShopPage";
import Search from "./pages/Search";
import SeachShops from './pages/SearchShops'
import UpdateShop from "./pages/UpdateShop";
import Employee from "./component/Employee";
import AddOrder from "./pages/AddOrder";
import AddTailoring from "./pages/AddTailoring";
import TODetaile from './pages/TODetaile';
import Home from "./pages/Home";
import About from './components/About/About';
import SalePage from './components/Sale/Sale';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import HeaderUpper from "./component/headerUpper/HeaderUpper";
import Header from './component/Header'
import WomenWear from "./pages/WomenWear";
import KidsWear from "./pages/KidsWear";
import MenWear from './pages/MenWear'
import ShowShop from './pages/ShowShop'
import Messaging from "./pages/Messaging";
import DashCS from "./component/DashCS";


function App() {
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 500,
      easing: 'ease-in-out',
      delay: 50,
    });
    AOS.refresh();
  }, []);
  return (
    <BrowserRouter>
       <HeaderUpper/>
         <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/womenwear" element={<WomenWear />} />
          <Route path="/kidswear" element={<KidsWear />} />
          <Route path="/menwear" element={<MenWear />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchshops" element={<SeachShops />} />
          <Route path="/showshop/:shopslug/:shopId" element={<ShowShop />} />
          <Route path="/shop/:postSlug" element={<ShopPage />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/addorder" element={<AddOrder />} />
          <Route path="/tailoring" element={<TODetaile />} />
          <Route path="/addtailoring/:shopId" element={<AddTailoring />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/dashcs" element={<DashCS />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
             <Route path="/create-shop" element={<CreateShop />} />
           <Route path="/update-post/:shopId" element={<UpdateShop />} />
          <Route path="/about" element={<About />} />
          <Route path="/sale" element={<SalePage />} />
        </Routes>
       <Footer /> {/* Always render the Footer */}
     </BrowserRouter>
  );
}

export default App;
