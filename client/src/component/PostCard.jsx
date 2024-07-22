import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  if (!post) {
    console.log("Product is not being passed correctly or not present");
    return null; // Return null if post is undefined
  }

  const handleOrderNow = () => {
    navigate('/addorder', { state: { post } });
  };

  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[250px] sm:w-[250px] sm:h-[300px] overflow-hidden rounded-lg transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[150px] sm:h-[200px] w-full object-cover group-hover:h-[100px] sm:group-hover:h-[150px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-2 flex flex-col gap-1">
        <div className="flex border-b pb-1 justify-between">
        <p className="text-md font-semibold line-clamp-1">{post.name}</p>
        <span className="italic text-sm">Price: {post.price}</span>
        </div>
        <div className="flex items-center justify-end text-center">
          <FaStar className="mt-1 text-yellow-400 mr-1" size={15} />
          <span>5</span>
        </div>
        <div
          className="max-w-full w-full pb-14 post-content line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></div>
        <button
          onClick={handleOrderNow}
          className="z-10 group-hover:bottom-0 absolute bottom-[-100px] sm:bottom-[-120px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-1 rounded-md !rounded-tl-none m-1"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
