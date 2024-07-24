import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NewCard from "../component/NewCard";
import CommentSection from "../component/CommentSection";
import { Button, Spinner } from "flowbite-react";

export default function ShopPage() {
  const { shopslug } = useParams();
  const [loading, setLoading] = useState(true);
  const [errOccur, setErrOccur] = useState(false);
  const [shop, setshop] = useState([]);
  const [recentShops, setRecentShops] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { shops } = location.state;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setErrOccur(false);

        const res = await fetch(`/api/post/getPosts?slug=${shops.slug}`);
        const data = await res.json();

        if (res.ok) {
          setErrOccur(false);
          setLoading(false);
          setshop(data.posts[0]);
        } else {
          setErrOccur(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setErrOccur(true);
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopslug]);

  useEffect(() => {
    const fetchRecentShops = async () => {
      try {
        const res = await fetch(`/api/product/getProducts?shopId=${shops._id}`);
        if (res.ok) {
          const data = await res.json();
          setRecentShops(data.products);
        } else {
          throw new Error("Failed to fetch recent shops");
        }
      } catch (error) {
        console.error("Error fetching recent shops:", error);
      }
    };

    fetchRecentShops();
  }, [shops]);

  const goToMeasurement = (shopId) => {
    if (currentUser) {
      navigate(`/addtailoring/${shopId}`);
    } else {
      alert("Buddy, you have to sign in first to submit your measurement.");
      navigate("/signin");
      return;
    }
  };

  const goToMessaging = (shop) => {
    if (currentUser) {
      navigate("/messaging", { state: { shop: shop } });
    } else {
      alert("Buddy, you have to sign in first to send a message.");
      navigate("/signin");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size={"xl"} />
        </div>
      ) : errOccur ? (
        "An error occurred while fetching the shop."
      ) : (
        <div>
          {shop && (
            <main className="flex flex-col max-w-4xl rounded-md my-5 mx-auto p-3 pb-8 border ">
              <img
                src={shop && shop.image}
                alt={shop && shop.title}
                className="mt-5 max-h-72 max-w-36 mx-auto rounded-full px-3 w-full object-cover"
              />
              <h1 className="text-3xl mt-2 text-center p-3 font-sarif mix-w-2xl mx-auto lg;text-4xl">
                {shop.title}
                <span className="ml-3">Store</span>
              </h1>

              <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl ">
                <span className="text-xl font-semibold">
                  {shop && new Date(shop.createdAt).toLocaleDateString()}
                </span>
                <span className="italic font-semibold">
                  <span className="pr-2 text-xl">Total Products </span>
                  {recentShops &&
                    (recentShops.length > 0 ? recentShops.length + 1 : 0)}
                </span>
              </div>
              <div
                className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl
              "
              >
                <p>
                  Bank Account:{" "}
                  {shop.bankAccount ? shop.bankAccount : "Not Available"}
                </p>
                <p>
                  Easypaisa:{" "}
                  {shop.easypaisaAccount
                    ? shop.easypaisaAccount
                    : "Not Available"}
                </p>
              </div>
              <div
                className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl
              "
              >
                <p>
                  Location: {shop.location ? shop.location : "Not Available"}
                </p>
                <p>Contact: {shop.contact ? shop.contact : "Not Available"}</p>
              </div>
              {shop && shop.content ? (
                <>
                  <p className="px-3 max-w-2xl mx-auto font-semibold mt-2  w-full">
                    Description
                  </p>
                  <div
                    className="p-3 max-w-2xl mx-auto w-full shop-content"
                    dangerouslySetInnerHTML={{ __html: shop.content }}
                  ></div>
                </>
              ) : (
                <div>No content available</div>
              )}
            </main>
          )}
          <div className="max-w-2xl p-1 text-xl font-bold items-center justify-center flex mx-auto b mb-3">
            Submit your body measurement to get your custom size suit.
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        <div className=" flex md:w-6/12 w-full justify-between px-4">
             <button
              onClick={() => goToMeasurement(shop._id)}
              className="bg-gradient-to-r mb-3 justify-between from-primary to-secondary
                    hover:scale-105 duration-200 text-xs sm:text-sm text-white py-2 px-4 rounded-full"
            >
              Submit Now
            </button>
          <button
            onClick={() => goToMessaging(shop)}
            className="bg-gradient-to-r mb-3 text-xs sm:text-sm justify-between from-primary to-secondary
                    hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
          >
            Message Now
          </button>
         </div>
        
      </div>
      {
     //  ( shop.category === "Tailor" || shop.category === "Tailor") &&
      }
      <div className=" flex rounded-md justify-center items-center flex-col ">
      <iframe className="rounded-md" width="460" height="215" src="https://www.youtube.com/embed/uat4BpIzgx8?si=XYoJtMbvTjl7Vorx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          <p className="text-sm mt-2 font-semibold">Video for guide how to Take measurement</p>
         </div>
      {/* <div>{shop && <CommentSection postId={shop._id} />}</div> */}
      <div className="flex flex-col justify-center items-center mb-5 ">
        <h1 className="text-xl mt-5">Recent Products</h1>
        <div className="flex flex-wrap mt-5 gap-5 justify-center">
          <div className="px-3 flex max-w-4xl p-4 flex-wrap gap-4 sm:gap-8 justify-center">
            {recentShops ? (
              recentShops.map((shop) => (
                <NewCard key={shop._id} products={shop} />
              ))
            ) : (
              <div>No recent products available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
