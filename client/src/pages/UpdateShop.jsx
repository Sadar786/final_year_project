import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateShopStart,
  updateShopSuccess,
  updateShopFailure,
} from "../redex/shop/shopSlice.js";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const navigate = useNavigate();
  const { shopId } = useParams();
  const { myShop } = useSelector((state) => state.shop);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?shopId=${shopId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          console.log("Fetched post data: ", data.posts[0]);
          // Ensure _id is present in the fetched data
          console.log("Fetched post ID: ", data.posts[0]._id);
          setFormData(data.posts[0]);
          setPublishError(null);
        }
      } catch (error) {
        console.log(error.message);
        setPublishError("Failed to fetch post data.");
      }
    };
    fetchPost();
  }, [shopId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            // Use functional update to ensure the previous state is not lost
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if _id and currentUser._id are present before submission
    if (!formData._id || !currentUser._id) {
      setPublishError("Post ID or User ID is missing");
      console.log("Post ID or User ID is missing");
      return;
    }
    console.log("Submitting form data: ", formData); // Add this line

    try {
      dispatch(updateShopStart());
      const res = await fetch(
        `/api/post/UpdatePost/${myShop._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishError("Error: " + data.message);
        setPublishSuccess(null);
        console.log("Error occurred: " + data.message);
        dispatch(updateShopFailure());
        return;
      }
      if (res.ok) {
        setPublishSuccess("Your shop has been updated Successfully.");
        setPublishError(null);
        dispatch(updateShopSuccess(data));
        setTimeout(() => {
          navigate(`/dashboard?tab=products`);
        }, 2000);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.log("Error in submitting:", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Shop</h1>

      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-2 flex-col md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            className="flex-1"
            onChange={(e) =>
              // Use functional update to ensure previous state is not lost
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tailoringServices: e.target.value,
              }))
            }
            value={formData.tailoringServices}
          >
            <option value="all">Tailoring Services</option>
            <option value="all">All Type</option>
            <option value="men">Gants</option>
            <option value="women">Ladias</option>
            <option value="kids">Kids </option>
          </Select>
        </div>
        <div className="flex gap-2 flex-col md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Bank Account"
            required
            className="flex-1"
            onChange={(e) =>
              // Use functional update to ensure previous state is not lost
              setFormData((prev) => ({ ...prev, bankAccount: e.target.value }))
            }
            value={formData.bankAccount}
          />
          <TextInput
            type="text"
            placeholder="Easypaisa Account"
            required
            className="flex-1"
            onChange={(e) =>
              // Use functional update to ensure previous state is not lost
              setFormData((prev) => ({
                ...prev,
                easypaisaAccount: e.target.value,
              }))
            }
            value={formData.easypaisaAccount}
          />
        </div>
        <div className="flex gap-2 flex-col md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Location"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            value={formData.location}
          />
          <TextInput
            type="text"
            placeholder="Contact"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact: e.target.value }))
            }
            value={formData.contact}
          />
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            type="button"
            onClick={handleUploadImage}
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <CircularProgressbar
                className="w-20"
                value={imageUploadProgress}
                text={imageUploadProgress || 0}
              />
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="Post image"
            className="w-full h-72 object-cover"
          />
        )}
        <TextInput
          onChange={(e) =>
            // Use functional update to ensure previous state is not lost
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          value={formData.content}
          type="text"
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write Your Post"
          required
        />

        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Update
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
        {publishSuccess && <Alert color={"success"}>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
