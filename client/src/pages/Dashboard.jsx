import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../component/DashSidebar";
import DashComments from "../component/DashComments";
import DashShops from "../component/DashShops";
import DashProfile from "../component/DashProfile";
import DashUser from "../component/DashUser";
import DashboardComp from "../component/DashboardComp";
import MyProducts  from '../component/MyProducts';
import AllProducts from "../component/AllProducts";
import AddProduct from "../component/AddProduct";
import Employee from '../component/Employee'
import AddEmployee from '../component/AddEmployee'
import DashOrders from '../component/DashOrders';
import AddOrder from './AddOrder'
import MyTailoring from "../component/MyTailoring";
import DashMyOrders from '../component/DashMyOrders'
import MyMeasurement from "../component/MyMeasurement";
import ShopOwnerDash from '../component/ShopOwnerDash'
import MonthlyReportOfShop from "../component/MoReportOfShop";
import UserMessages from "../component/UserMessages";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row ">
      {/* sidebar */}
      <div className=" lg:full">
        <DashSidebar />
      </div>
      <div className="w-full">
        {/* profile... */}
        {tab === "profile" && <DashProfile />}
        {/* the orders I placed ... */}
        {tab === "userorder" && <DashMyOrders />}
        {/* create product... */}
        {tab === "addproduct" && <AddProduct />}
        {/* products... */}
        {tab === "products" && <MyProducts />}
        {/* All Prodcuts... */}
        {tab === "allproduct" && <AllProducts />}
        {/* shopdashboard */}
        {tab === "shops" && <DashShops />}
        {/* report */}
        {tab === "mofinancereport" && <MonthlyReportOfShop />}
        {/* users */}
        {tab === "users" && <DashUser />}
        {/* comments */}
        {tab === "comments" && <DashComments />}
        {/* dashbordComp */}
        {tab === "dashboardComp" && <DashboardComp />}
        {/* shop owner dashboard */}
        {tab === "shopownerdash" && <ShopOwnerDash />}
        {/* employee */}
        {tab === "employee" && <Employee/>}
        {/* addemployee */}
        {tab === "addemployee" && <AddEmployee/>}
        {/* orders */}
        {tab === "order" && <DashOrders/>}
        
        {/* my tailoring */}
        {tab === "tailoring" && <MyTailoring/>}
        {/* my mymeasurement */}
        {tab === "mymeasurement" && <MyMeasurement/>}
        {/* my user messages */}
        {tab === "usermessages" && <UserMessages/>}
        
      </div>
    </div>
  );
}
