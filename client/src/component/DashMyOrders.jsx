import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Modal, Select } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashOrders() {
  const { currentUser } = useSelector((state) => state.user);
  const [DashOrders, setDashOrders] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [OrdersIdToDelete, setOrdersIdToDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateData, setUpdateDate] = useState({});
  const [showModalApprove, setShowModalApprove] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashOrders = async () => {
      try {
        const response = await fetch(
          `/api/order/getOrders?customer=${currentUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch DashOrders");
        }
        const data = await response.json();
        setDashOrders(data.Orders);

        if (data.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (currentUser) {
      fetchDashOrders();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchShopData = async () => {
      const ordersWithCustomers = await Promise.all(
        DashOrders.map(async (order) => {
          const res = await fetch(`/api/post/getPosts?shopId=${order.shopId}`);
          const data = await res.json();
          return { ...order, shopData: data.posts[0] };
        })
      );
      setDashOrders(ordersWithCustomers);
    };

    if (DashOrders.length > 0) {
      fetchShopData();
    }
  }, [DashOrders.length]); // Add length as a dependency to avoid continuous requests

  const handleShowMore = async () => {
    const startIndex = DashOrders.length;

    try {
      const res = await fetch(
        `/api/order/getOrders?customer=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.Orders)) {
          setDashOrders((prev) => [...prev, ...data.Orders]);
          if (data.Orders.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch Orders");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteOrders = async () => {
    setShowModal(false);

    try {
      const res = await fetch(
        `/api/order/deleteOrder/${OrdersIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setDashOrders((prev) =>
          prev.filter((order) => order._id !== OrdersIdToDelete)
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const goToStore = (shopData) => {
    console.log("Navigating to store with data:", shopData);
    navigate(`/showshop/${shopData.slug}/${shopData._id}`, { state: { shops: shopData } });
  };
  return (
    <div className="table-auto lg:flex flex-col w-full justify-center items-center  overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {DashOrders.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Store Name</Table.HeadCell>
              <Table.HeadCell>Paid Amount</Table.HeadCell>
              <Table.HeadCell>Payment Method</Table.HeadCell>
              <Table.HeadCell>Store Location</Table.HeadCell>
              <Table.HeadCell>Order Approved</Table.HeadCell>
              <Table.HeadCell>Order Status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {DashOrders.map((order, index) => (
              <Table.Body key={index} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>

                    <span onClick={()=> goToStore(order.shopData)} className="dark:hover:underline dark:hover:text-white">
                    <img
                      className="w-14 rounded-full"
                      src={order.shopData?.image}
                      alt={order.shopData?.title}
                    />
                    <p className="text-semibold">{order.shopData?.title}</p>
                    </span>
                  </Table.Cell>
                  <Table.Cell>{order.paidAmcount}</Table.Cell>
                  <Table.Cell>
                    {order.paymentMethod
                      ? "Cash on delivery"
                      : order.paymentMethod}
                  </Table.Cell>
                  <Table.Cell>{order.shopData?.location? order.shopData.location : "N/A"}</Table.Cell>
                  <Table.Cell>
                    {!order.ownerApproval ? "Not Approved" : "Approved"}
                  </Table.Cell>
                  <Table.Cell>{order.status}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setOrdersIdToDelete(order._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Cencel
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
        <p>You have no Orders yet.</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to Cencel this Orders?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteOrders}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalApprove}
        onClose={() => setShowModalApprove(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Select
              onChange={(e) => {
                setUpdateDate({ ...updateData, ownerApproval: e.target.value });
              }}
            >
              <option value={"false"}>Approval Status</option>
              <option value="true">Approve</option>
              <option value="false">Not Approve</option>
            </Select>
            <div className="flex justify-between items-center mt-2">
              <Button color="red" onClick={() => setShowModalApprove(false)}>
                Cancel
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModalApprove(false);
                  handleApproval();
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModal1}
        onClose={() => setShowModal1(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Select
              onChange={(e) => {
                setUpdateDate({
                  ...updateData,
                  status: e.target.value,
                });
              }}
            >
              <option>Order Status</option>
              <option value="Pending">Pending</option>
              <option value="Proccessing">Proccessing</option>
              <option value="Completed">Completed</option>
            </Select>

            <div className="flex justify-between items-center mt-2">
              <Button color="red" onClick={() => setShowModal1(false)}>
                Cancel
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal1(false);
                  handleApproval();
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
