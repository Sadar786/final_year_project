import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiAdjustments,
  HiUserGroup,
  HiCalendar,
  HiSpeakerphone,
  HiTemplate,
} from "react-icons/hi";
import { FaChartLine, FaBox, FaTags, FaShoppingCart, FaTag } from 'react-icons/fa'; 
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redex/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signOutDone } from "../redex/shop/shopSlice";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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

  return (
    <Sidebar className=" w-full lg:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dashboardComp">
              <Sidebar.Item
                active={tab === "dashboardComp" || !tab}
                as="div"
                icon={HiChartPie}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.haveAShop && (
            <Link to="/dashboard?tab=shopownerdash">
              <Sidebar.Item
                active={tab === "shopownerdash" || !tab}
                as="div"
                icon={HiChartPie}
              >
                Shop Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.haveAShop && (
            <Link to="/dashboard?tab=mofinancereport">
              <Sidebar.Item
                active={tab === "mofinancereport" || !tab}
                as="div"
                icon={FaChartLine}
              >
                Finance Report
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={
                currentUser.isAdmin
                  ? "Admin"
                  : currentUser.haveAShop
                  ? "Shop Owner"
                  : "User"
              }
              labelColor="dark"
              className="cursor-pointer"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser && !currentUser.isAdmin && !currentUser.haveAShop && (
            <Link to="/dashboard?tab=userorder">
              <Sidebar.Item
                active={tab === "userorder"}
                icon={HiDocumentText}
                className="cursor-pointer"
                as="div"
              >
                My Orders
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && !currentUser.isAdmin && !currentUser.haveAShop && (
            <Link to="/dashboard?tab=mymeasurement">
              <Sidebar.Item
                active={tab === "mymeasurement"}
                icon={HiDocumentText}
                className="cursor-pointer"
                as="div"
              >
                My Measurement
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=shops">
              <Sidebar.Item
                active={tab === "shops"}
                icon={FaShoppingCart}
                className="cursor-pointer"
                as="div"
              >
                All Shops
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.haveAShop && (
            <Link to={`/shop/${myShop.slug}`}>
              <Sidebar.Item
                active={tab === `shop/${myShop.slug}`}
                icon={HiAdjustments}
                className="cursor-pointer"
                as="div"
              >
                My Shop
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.haveAShop && (
            <Link to="/dashboard?tab=products">
              <Sidebar.Item
                active={tab === "products"}
                icon={FaTags}
                className="cursor-pointer"
                as="div"
              >
                My Products
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=allproduct">
              <Sidebar.Item
                active={tab === "allproduct"}
                icon={HiSpeakerphone}
                className="cursor-pointer"
                as="div"
              >
                All Products
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.haveAShop && (
            <Link to="/dashboard?tab=employee">
              <Sidebar.Item
                active={tab === "employee"}
                icon={HiUserGroup}
                className="cursor-pointer"
                as="div"
              >
                My Employee
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.haveAShop && (
            <Link to="/dashboard?tab=order">
              <Sidebar.Item
                active={tab === "order"}
                icon={HiCalendar}
                className="cursor-pointer"
                as="div"
              >
                User's Orders
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.haveAShop && (
            <Link to="/dashboard?tab=tailoring">
              <Sidebar.Item
                active={tab === "tailoring"}
                icon={HiTemplate}
                className="cursor-pointer"
                as="div"
              >
                Tailoring Order
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                className="cursor-pointer"
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.haveAShop && (
            <Link to="/dashboard?tab=usermessages">
              <Sidebar.Item
                active={tab === "usermessages"}
                icon={HiOutlineUserGroup}
                className="cursor-pointer"
                as="div"
              >
                Users Messages
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            onClick={handleSignout}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
