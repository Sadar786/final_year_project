import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function MyTailoring() {
  const { currentUser } = useSelector((state) => state.user);
  const [myMeasurement, setMyMeasurement] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tailoringIdToDelete, setTailoringIdToDelete] = useState("");
  const [error, setError] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [showModalApprove, setShowModalApprove] = useState(false);
  const navigate = useNavigate();
  const [tailoringStatus, setTailoringStatus] = useState('')

  useEffect(() => {
    const fetchMyMeasurement = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/tailoring/getTailoring?customerId=${currentUser._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch myMeasurement");
        }
        const data = await response.json();
        setMyMeasurement(data.Tailorings);
        if (data.Tailorings.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (currentUser) {
      fetchMyMeasurement();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchShopData = async () => {
      setError(null);
      try {
        const tailoringsWithCustomers = await Promise.all(
          myMeasurement.map(async (tailoring) => {
            const res = await fetch(`/api/post/getPosts?shopId=${tailoring.shopId}`);
            const data = await res.json();
            return { ...tailoring, shopData: data.posts[0] };
          })
        );
        setMyMeasurement(tailoringsWithCustomers);
      } catch (error) {
        setError(error.message);
      }
    };

    if (myMeasurement.length > 0) {
      fetchShopData();
    }
  }, [myMeasurement.length]);

  const handleShowMore = async () => {
    setError(null);
    const startIndex = myMeasurement.length;

    try {
      const res = await fetch(`/api/tailoring/getTailoring?customerId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.Tailorings)) {
          setMyMeasurement((prev) => [...prev, ...data.Tailorings]);
          if (data.Tailorings.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch tailorings");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const checkStatus =async  () => {
    if(tailoringStatus === 'Pending' || tailoringStatus === 'Proccessing'){
      alert("You Cant delete it if its not Completed!")
      return;
    }
    else{
      await setShowModal(true);
    }
  }
  const handleDeleteTailoring = async () => {
    const updatePayload = {
      ...updateData,
      removeFromUser: true,
    };
    setError(null);
    setShowModal(false);
    try {
      const res = await fetch(`/api/tailoring/updateTailoring/${tailoringIdToDelete}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setMyMeasurement((prev) => prev.filter((tailoring) => tailoring._id !== tailoringIdToDelete));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewOrder = (tailoring) => {
    navigate("/tailoring", { state: { tailoring } });
  };

  const goToStore = (shop) => {
    navigate(`/showshop/${shop.slug}/${shop._id}`, { state: { shops: shop } });
  };

  return (
    <div className="table-auto md:flex items-center flex-col justify-center w-full overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h1 className="text-xm sm:text-lg  sm:p-2 text-center p-1 rounded-md dark:bg-slate-700 m-2">
        The measurements I have submitted to Stores
      </h1>
      {currentUser ? (
        myMeasurement.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Shop</Table.HeadCell>
                <Table.HeadCell>Payment Method</Table.HeadCell>
                <Table.HeadCell>Tailoring price</Table.HeadCell>
                <Table.HeadCell>Shop Location</Table.HeadCell>
                <Table.HeadCell>Completion date</Table.HeadCell>
                <Table.HeadCell>Tailoring Status</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {myMeasurement.map(
                (tailoring, index) =>
                  !tailoring.removeFromUser && (
                    <Table.Body key={index} className="divide-y">
                      <Table.Row className="bg-white dark:bg-gray-800">
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600"
                            onClick={() => handleViewOrder(tailoring)}
                          >
                            {new Date(tailoring.updatedAt).toLocaleDateString()}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div
                            onClick={() => goToStore(tailoring.shopData)}
                            className="hover:underline dark:hover:text-white rounded-md cursor-pointer"
                          >
                            <img
                              className="w-14 rounded-full"
                              src={tailoring.shopData?.image}
                              alt={tailoring.shopData?.title}
                            />
                            <p>{tailoring.shopData?.title}</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600"
                            onClick={() => handleViewOrder(tailoring)}
                          >
                            {tailoring?.paymentMethod
                              ? "Cash on delivery"
                              : tailoring.paymentMethod}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600"
                            onClick={() => handleViewOrder(tailoring)}
                          >
                            {tailoring?.tailoringPrice}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600"
                            onClick={() => handleViewOrder(tailoring)}
                          >
                            {tailoring?.shopData?.location || "N/A"}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="hover:underline dark:hover:text-white hover:text-blue-600">
                            {tailoring.completion_date || "Not Available"}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600"
                            onClick={() => handleViewOrder(tailoring)}
                          >
                            {tailoring.status}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="hover:underline dark:hover:text-white hover:text-blue-600 font-medium text-red-500 cursor-pointer"
                            onClick={() => {
                              checkStatus();
                              setTailoringIdToDelete(tailoring._id);
                              setTailoringStatus(tailoring.status)
                            }}
                          >
                            Delete
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  )
              )}
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
          <p className="text-3xl pt-5 font-light">
            You don't have any tailoring orders yet
          </p>
        )
      ) : (
        <p className="text-3xl pt-5 font-light">
          You don't have a shop yet. Please create a shop to view your tailoring orders.
        </p>
      )}
      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this tailoring order?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteTailoring}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
