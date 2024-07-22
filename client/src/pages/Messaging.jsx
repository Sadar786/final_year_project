import React, { useState, useEffect } from "react";
 import CommentSection from "../component/CommentSection";
import { useLocation } from "react-router-dom";

const Messaging = () => {
  const location = useLocation();
  const { shop } = location.state;

  return (
    <div className="flex  flex-col items-center w-full justify-center">
      <div className="flex w-full justify-center items-center  ">
        <div className="flex mt-8 flex-col ">
          <img src={shop.image} className="w-20 rounded-full" alt="" />
          <span className="mt-5 font-bold">{shop.title}</span>
        </div>
        <div>
          {" "}
          <span className="font-semibold">{shop.location}</span>
        </div>
      </div>

      <CommentSection shop={shop} />
    </div>
  );
};

export default Messaging;
