import { Alert, Button, Textarea, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import {HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({ shop }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(comment.length === 0){
      alert("add message first");
      return;
    }

    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId: shop._id,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCommentError(null);
        setComment("");
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log(error.message);
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComment/${shop._id}/${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setComments(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("An error occurred while fetching comments:", error);
        }
      }
    };

    getComments();
  }, [shop._id]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
              : comment
          )
        );
      } else {
        console.error("Failed to like the comment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setComments(
      comments.map((comment) =>
        comment._id === comment._id ? { ...comment, content: editedContent } : comment
      )
    );
  };


  const handleDelete = async (commentId) =>{
    try {
      if(!currentUser){
        navigate('/signin')
        return;
      };
      const res = await fetch(`/api/comment/deleteComment/${commentId}`,
        {
          method: "DELETE"
        });

        if(res.ok){
          const data = await res.json();
              setComments(comments.filter((comment)=> comment._id !== commentId))
        }

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="max-w-2xl p-3 w-full mx-auto ">
      {currentUser ? (
        <div className="flex text-gray-500 my-5 gap-1 items-center text-sm">
          <p>Signed in as:</p>
          {currentUser.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              className="w-5 h-5 rounded-full object-cover"
              alt="User avatar"
            />
          ) : (
            <div>No image</div>
          )}
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username || "Unknown User"}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 flex gap-1 text-sm my-5">
          You must be Signed in to message!
          <Link className="text-blue-500 hover:underline" to={`/signin`}>
            Sign In
          </Link>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm py-7">No message yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>messages</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comments
              key={comment._id}
              comment={comment}
              shop={shop}
              onLike={handleLike}
              onEdit={handleEdit}

              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId)
              }}
            />
          ))}
        </>
      )}
      
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            rows={3}
            placeholder="write your Message"
            maxLength="200"
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && <Alert color="failure">{commentError}</Alert>}
        </form>
      )}

         <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your Comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={()=>{
                setShowModal(false)
                handleDelete(commentToDelete)}
                }>Yes, I'm sure.</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
