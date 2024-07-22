import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Modal, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [Comment, setComment] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getComments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log the entire response

        const commentsArray = data.comments || []; // Ensure it's an array
        setComment(commentsArray);
        console.log("State set to:", commentsArray); // Debugging line
        if (commentsArray.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError("Error from useEffect: " + error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = Comment.length;

    try {
      const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`);
      const data = await res.json();
      console.log("Fetched more data:", data); // Debugging line

      if (res.ok) {
        const commentsArray = data.comments || []; // Ensure it's an array
        setComment((prev) => [...prev, ...commentsArray]);
        if (commentsArray.length < 9) {
          setShowMore(false);
        }
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      setError("Error from showMore: " + error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);

    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setComment((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      setError("Error from delete: " + error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin ? (
        Comment.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>Post Id</Table.HeadCell>
                <Table.HeadCell>User id</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {Comment.map((comment, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
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
          <p>You have no comments yet.</p>
        )
      ) : (
        <p>Only admins can view comments.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {error && (
        <Alert color="failure" className="mb-5">
          {error}
        </Alert>
      )}
    </div>
  );
}
