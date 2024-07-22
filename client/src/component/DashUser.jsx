import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, Modal, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `/api/user/getUsers?userId=${currentUser._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users || []);
        if (data.users.length < 9) {
          // Corrected: Changed data.length to data.users.length
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUser();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.users)) {
          setUsers((prev) => [...prev, ...data.users]);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to fetch User");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      const res = await fetch(
        `/api/user/deleteUser/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="lg:flex flex-col justify-center my-8 items-center w-full table-auto overflow-x-scroll md:ax-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-500"
    >
      {currentUser.isAdmin ? (
        users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>{" "}
                 <Table.HeadCell>User Image</Table.HeadCell>{" "}
                 <Table.HeadCell>Username</Table.HeadCell>{" "}
                 <Table.HeadCell>Admin</Table.HeadCell>{" "}
                 <Table.HeadCell>email</Table.HeadCell>{" "}
                 <Table.HeadCell>Store</Table.HeadCell>{" "}
                 <Table.HeadCell>Delete</Table.HeadCell>{" "}
               </Table.Head>

              {users.map((user, index) => {
                return (
                  <Table.Body key={index} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          className="w-10 rounded-full h-10 object-cover bg-gray-500"
                          alt={user.username}
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </Table.Cell>{" "}
                      {/* Displaying isAdmin as Yes/No */}
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user?.haveAShop ? (<FaCheck className="text-green-500" />):(<FaTimes className="text-red-500" />) }</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id); // Corrected: Changed from setUsererIdToDelete to setUserIdToDelete
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
              <button
                className="text-teal-500 self-center text-sm py-7 w-full"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You have no User yet.</p>
        )
      ) : (
        <p>Only admins can view User.</p>
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete this User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && <Alert color="failure" className="mb-5">{error}</Alert>}
    </div>
  );
}
