import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";

export default function Comments({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("An error occurred while fetching user data:", error);
      }
    };

    getUser();
  }, [comment.userId]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex text-xs p-4 border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt={user.username || "Anonymous user"}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-3 justify-end text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                outline
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 gap-2 max-w-fit">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-sm text-gray-500 hover:text-blue-500 ${
                  currentUser && comment.likes.includes(currentUser._id)
                    ? "!text-blue-500"
                    : ""
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0
                  ? `${comment.numberOfLikes} ${
                      comment.numberOfLikes === 1 ? "Like" : "Likes"
                    }`
                  : ""}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                  <button
                    onClick={() => setIsEditing(true)}
                    type="button"
                    className="text-gray-500 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    type="button"
                    className="text-gray-500 hover:text-red-500"
                  >
                    Delete
                  </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
