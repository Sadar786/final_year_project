import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { deleteShopSuccess, deleteShopFailure, deleteShopStart } from "../redex/shop/shopSlice";
import { deleteUserSuccess } from "../redex/user/userSlice";

export default function DashShops() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
   const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getPosts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shops");
        }
        const data = await response.json();
        if(response.ok){
        setPosts(data.posts);
         }
        if (data.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  
  const handleShowMore = async () => {
    const startIndex = posts.length;

    try {
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.posts)) {
          setPosts((prev) => [...prev, ...data.posts]);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const makeUserShopOwner = async () =>{
    const haveAShop = { haveAShop: false }; // Ensure correct formatting for the body
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(haveAShop),
      });
      
      const data = await res.json();
      if (!res.ok) {
         dispatch(updateFaluire(data.message));
      } else {
        dispatch(updateSuccess(data));
       }
    } catch (error) {
      dispatch(updateFaluire(error.message));
     }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    if(!currentUser.isAdmin){
    dispatch(deleteUserSuccess());
    }

    try {
      const res = await fetch(`/api/post/deletePost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        dispatch(deleteShopFailure());
      } else {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));

        if(!currentUser.isAdmin){
          dispatch(deleteShopSuccess());
          makeUserShopOwner();
          }
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const  goToStore = (shop) =>{
    navigate(`/showshop/${shop.slug}/${shop._id}`,{ state: { shops: shop } })
  }
  return (
    <div className=" lg:flex flex-col justify-center items-center w-full table-auto overflow-x-scroll md:ax-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin ? (
        posts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell className="">Date</Table.HeadCell>
                <Table.HeadCell className="">Logo</Table.HeadCell>
                <Table.HeadCell className="">Shop Name</Table.HeadCell>
                <Table.HeadCell className="">Category</Table.HeadCell>
                 <Table.HeadCell className="">Delete</Table.HeadCell>
                
              </Table.Head>

              {posts.map((post, index) => {
                return (
                  <Table.Body key={index} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        
                           <img   onClick={()=> goToStore(post)}
                            src={post.image}
                            className="w-20 rounded-full h-10 object-cover bg-gray-500"
                            alt=""
                          />
                       </Table.Cell>
                      <Table.Cell>
                        <span  onClick={()=> goToStore(post)}
                          className="font-medium text-gray-900 dark:text-white hover:underline cursor-pointer "
                         >

                          {post.title}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                       <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      
                    </Table.Row>
                  </Table.Body>
                );
              })}
            </Table>
            {showMore && (
              <button className="text-teal-500 self-center text-sm py-7 w-full" onClick={handleShowMore}>Show more</button>
            )}
          </>
        ) : (
          <p>You have no Shops yet.</p>
        )
      ) : (
        <p>Only admins can view Shops.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">Are you sure you want to delete this Shop?</h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeletePost}>Yes, I'm sure.</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && (
        <div className="text-red-500">{error}</div>
      )}
    </div>
  );
}
