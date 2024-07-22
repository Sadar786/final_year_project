import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewCard from '../component/NewCard'
import { useSelector } from "react-redux";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [errOccur, setErrOccur] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const { myShop } = useSelector((state) => state.shop);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setErrOccur(false);

        const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
        const data = await res.json();

        if (res.ok) {
          setErrOccur(false);
          setLoading(false);
          setPost(data.posts[0]);
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

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/product/getMyProducts/${myShop._id}`);
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data);
        } else {
          throw new Error("Failed to fetch recent posts");
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    if (myShop._id) {
      fetchRecentPosts();
    }
  }, [myShop._id]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size={"xl"} />
        </div>
      ) : errOccur ? (
        "An error occurred while fetching the post."
      ) : (
        <div>
          {post && (
            <main className="flex flex-col max-w-4xl rounded-md my-5 mx-auto p-3 pb-8 border ">
              <img
                src={post && post.image}
                alt={post && post.title}
                className="mt-5 max-h-72 max-w-36 mx-auto rounded-full px-3 w-full object-cover"
              />
              <h1 className="text-3xl mt-2 text-center p-3 font-sarif mix-w-2xl mx-auto lg;text-4xl">
                {post.title}
                <span className="ml-3">Shop</span>
              </h1>
              {/* <Link
                to={`/search?category=${post && post.category}`}
                className="self-center mt-5"
              >
                <Button color={"gray"} pill size={"xs"}>
                  {post && post.category}
                </Button>
              </Link> */}

              <div className="flex justify-between  p-3 border-b border-slate-500 mx-auto w-full max-w-2xl ">
                <span className="text-xl font-semibold">
                  {post && new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="italic font-semibold">
                  <span className="pr-2 text-xl">Totel Products </span>
                  {recentPosts &&
                    (recentPosts.length > 0 ? recentPosts.length + 1 : 0)}
                </span>
              </div>
              {post && post.content ? (
                <>
                  <p className="px-3 max-w-2xl mx-auto font-semibold mt-2  w-full">Description</p>
                  <div
                    className="p-3 max-w-2xl mx-auto w-full post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></div>
                </>
              ) : (
                <div>No content available</div>
              )}
            </main>
          )}
          <div  className="max-w-2xl border flex mx-auto border-b-1 border-gray-300 max-h-1  mb-3"/>
        </div>
      )}

      <div className="flex justify-center gap-10 px-4">
        <div>
          <Link className="" to={"/dashboard?tab=addproduct"}>
            <Button>Add A Product</Button>
          </Link>
        </div>

        <div>
          <Link className="text-teal-500" to={`/update-post/${myShop._id}`}>
            <Button>Update Shop</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mb-5 ">
        <h1 className="text-xl mt-5">Recent Products</h1>
        <div className="flex flex-wrap mt-5 gap-5 justify-center">
          <div className="px-3 flex flex-wrap gap-2 sm:gap-4 justify-center">
            {recentPosts ? (
              recentPosts.map((post) => <NewCard key={post._id} products={post} />)
            ) : (
              <div>No recent products available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
