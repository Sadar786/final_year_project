import { Alert, Button, TextInput, Modal } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
 import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFaluire,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redex/user/userSlice.js";
import {deleteShopSuccess} from '../redex/shop/shopSlice.js'
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const dispatch = useDispatch();
  const [imageFileLoading, setImageFileLoading] = useState(false);
  const [updatedUserSuccess, setUpdatedUserSuccess] = useState(false);
  const [updateUserError, setUpdatedUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
 

  const handleImageChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    setImageFileLoading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(2));
      },
      (error) => {
        setImageFileUploadingError(
          "Could not upload image (file must be less than 2MB): " + error.message
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setImageFileLoading(false);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setImageFileUploadingError("Error getting download URL.");
            setImageFileLoading(false);
          });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdatedUserError(null);
    setUpdatedUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdatedUserError("No changes made!!");
      return;
    }

    if (formData.username) {
      if (typeof formData.username !== 'string' || formData.username.length < 7 || formData.username.length > 20) {
        setUpdatedUserError("Username should be between 7 and 20 characters long");
        return;
      }
    }

    if (formData.password) {
      if (typeof formData.password !== 'string' || formData.password.length < 6) {
        setUpdatedUserError("Password should be at least 6 characters long");
        return;
      }
    }

    if (imageFileLoading) {
      setUpdatedUserError("Please wait for the image to upload!");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setUpdatedUserError("Error: " + data.message);
        dispatch(updateFaluire(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdatedUserSuccess("User profile updated successfully!");
        setUpdatedUserError(null);
      }
    } catch (error) {
      dispatch(updateFaluire(error.message));
      setUpdatedUserError("An error occurred: " + error.message);
    }
};

const handleDeleteUser = async () => {
  setShowModal(false);
  dispatch(deleteUserStart());

  try {
    // Extract the profile picture URL to delete later
    const pictureToDelete = currentUser.profilePicture;
    console.log("Profile picture URL to delete:", pictureToDelete); // Log the URL

    // Delete user from the backend
    const res = await fetch(`/api/user/deleteUser/${currentUser._id}`, {
      method: "DELETE",
    });

    const deleted = await res.json();

    if (!res.ok) {
      console.error("Error from server response:", deleted.message);
      dispatch(deleteUserFailure("Error occurred in deleting: " + deleted.message));
    } else {
      dispatch(deleteUserSuccess("User deleted successfully."));

      // Check if the user has a profile picture to delete
      if (pictureToDelete) {
        console.log("Attempting to delete the profile picture from Firebase Storage..."); // Log the action
        const imageRef = ref(getStorage(app), pictureToDelete);

        // Attempt to delete the profile picture from Firebase Storage
        try {
          await deleteObject(imageRef);
          console.log("Profile picture deleted successfully.");
        } catch (error) {
          console.error("Error deleting profile picture from Firebase Storage: ", error);
        }
      } else {
        console.log("No profile picture URL found for deletion.");
      }
    }
  } catch (error) {
    console.error("Error in handleDeleteUser function: ", error);
    dispatch(deleteUserFailure("Error: " + error.message));
  }
};

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: "POST"
      });
      const data = await res.json();
      if (!data.ok) {
        dispatch(signOutSuccess());
        dispatch(deleteShopSuccess());

      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative flex self-center w-32 h-32 cursor-pointer shadow-md rounded-full overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={parseFloat(imageFileUploadingProgress) || 0}
              text={`${parseFloat(imageFileUploadingProgress) || 0}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    parseFloat(imageFileUploadingProgress) / 100
                  })`,
                },
                trail: {
                  stroke: "#d6d6d6",
                },
                text: {
                  fill: "#000",
                  fontSize: "16px",
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadingError && (
          <Alert color="failure">{imageFileUploadingError}</Alert>
        )}
        <TextInput
          type="text"
          onChange={handleChange}
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="text"
          onChange={handleChange}
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          onChange={handleChange}
          placeholder="*******"
          id="password"
        />

        <Button type="submit" outline gradientDuoTone="purpleToBlue" disabled={loading || imageFileLoading}>
          {loading ? "Loading..." : 'Update'}
        </Button>
        
      </form>
      <div className="text-red-500 justify-between flex mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      {updatedUserSuccess && (
        <Alert color="success" className="mt-5">
          {updatedUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>Yes, I'm sure.</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
