import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import {HiOutlineExclamationCircle } from 'react-icons/hi'
import { useNavigate } from "react-router-dom";
export default function UserMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { myShop } = useSelector((state) => state.shop);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false)
  const [messagetToDelete, setMessageToDelete ]= useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/comment/getComments/${myShop._id}`);
        const data = await res.json();

        if (res.ok) {
          setMessages(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("An error occurred while fetching messages:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [myShop._id]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const messagesWithCustomers = await Promise.all(
        messages.map(async (message) => {
          const res = await fetch(`/api/user/getUser/${message.userId}`);
          const data = await res.json();
          return { ...message, customerData: data };
        })
      );
      setMessages(messagesWithCustomers);
    };

    if (messages.length > 0) {
      fetchCustomerData();
    }
  }, [messages.length]);

  if (loading) {
    return <div>Loading...</div>;
  }
 
  
  const handleDelete = async (commentId) => {
    try {
      if (!currentUser || !currentUser.haveAShop) {
        alert("You can't delete this.");
        // navigate("/signin"); // Uncomment if you have navigation logic
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages(messages.filter((message) => message._id !== commentId));
      } else {
        console.error("Failed to delete the message.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToChat = (user) =>{
    navigate(`/dashcs`, {state: {user: user}})
  }

  return (
    <div>
      <div className="overflow-x-auto sm:flex   justify-center items-center w-full ">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Customer Name</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>
              <span className=" ">delete</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {messages.length > 0 ? (
              messages.map((message) => (
                <Table.Row
                  key={message._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <span  onClick={()=> {
                      goToChat(message.customerData)
                    }}>

                    {message.customerData?.username || "Unknown"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{message.content || "No message"}</p>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                  <span
                      onClick={() => {
                        setShowModal(true);
                        setMessageToDelete(message._id);
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center">
                  No messages available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>








      <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your Comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={()=>{
                setShowModal(false)
                handleDelete(messagetToDelete)}
                }>Yes, I'm sure.</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
