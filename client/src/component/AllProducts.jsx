import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function AllProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setproductIdToDelete] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product/getProducts`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);

        if (data.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch products only if currentUser is admin or currentUser owns a shop
    if (currentUser.isAdmin || currentUser.haveAShop) {
      fetchProducts();
    }
  }, [currentUser, myShop._id]);

  const handleShowMore = async () => {
    const startIndex = products.length;

    try {
      const res = await fetch(
        // `/api/product/getMyProducts?shopId=${myShop._id}&startIndex=${startIndex}`
        `/api/product/getProducts/?startIndex=${startIndex}`

      );
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.products)) {
          setProducts((prev) => [...prev, ...data.products]);
          if (data.products.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteProducts = async () => {
    setShowModal(false);
  
    try {
      console.log("product id delete " + productIdToDelete);
      console.log("current user id delete " + currentUser._id);
      console.log('my shop id ' + myShop._id);
      
      const res = await fetch(`/api/product/deleteProduct/${productIdToDelete}/${currentUser._id}/${myShop._id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setProducts((prev) => prev.filter((shop) => shop._id !== productIdToDelete));
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="table-auto flex w-full items-center justify-center flex-col overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     
      { currentUser.isAdmin ? (
        products.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Picture</Table.HeadCell>
                <Table.HeadCell>Product Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {products.map((shop, index) => (
                <Table.Body key={index} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(shop.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/shop/${shop.slug}`}>
                        <img
                          src={shop.image}
                          className="w-20 rounded-sm h-10 object-cover bg-gray-500"
                          alt=""
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/shop/${shop.slug}`}
                      >
                        {shop.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{shop.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setproductIdToDelete(shop._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                className="text-teal-500 self-center text-sm py-7 w-full"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You have no Products yet.</p>
        )
      ) : (
        <p>Only admins and shop owners can view Products.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteProducts}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
