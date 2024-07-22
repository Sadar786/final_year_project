import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
 import { useLocation, useParams } from "react-router-dom";
import DashMsg from '../component/DashMsg'

const Messaging = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const { user } = location.state;

  return (
    <div className="flex  flex-col items-center w-full justify-center">
      <div className="flex w-full justify-center items-center  ">
        <div className="flex mt-8 flex-col ">
          <img src={shop.image} className="w-20 rounded-full" alt="" />
          <span className="mt-5 font-bold">{user.username}</span>
        </div>
        <div>
          {" "}
          <span className="font-semibold">{shop.contact}</span>
        </div>
      </div>

      <DashMsg userId={user} />
    </div>
  );
};

export default Messaging;
  