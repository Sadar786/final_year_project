import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useDebugValue, useEffect, useState } from "react";
import ReactQuill from "react-quill";
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
import { useNavigate } from "react-router-dom";
import { shopIsCreated } from "../redex/shop/shopSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFaluire,
  updateStart,
  updateSuccess,
} from "../redex/user/userSlice.js";

export default function AddProduct() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSucess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { myShop } = useSelector((state) => state.shop);

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
          setImageUploadError("Image upload failed" + error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const formWithIds = {
    ...formData,
    shopId: myShop._id,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/product/createProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Corrected 'Application/json' to 'application/json'
        },
        body: JSON.stringify(formWithIds),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishError("Error: " + data.message);
        setPublishSucess(null);
        console.log("error occur: " + data.message);
        return;
      }
      if (res.ok) {
        setPublishSucess("Your Post has been Published Successfully.");
        setPublishError(null);
        navigate(`/dashboard?tab=products`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.log("Error in submitting:", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Product</h1>

      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Product Name"
            required
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncatagorized">Select catagory</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids </option>
          </Select>
        </div>
        <div className=" flex  flex-col gap-2 md:flex-row">
          <TextInput
            type="number"
            placeholder="Price"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <TextInput
            type="number"
            placeholder="Quantity"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Description"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className=" flex  flex-col justify-between gap-2 md:flex-row">
          <Select
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
          >
            <option value="0">0%</option>
            <option value="10">10%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
            <option value="40">40%</option>
            <option value="50">50%</option>
            <option value="60">60%</option>
            <option value="70">70%</option>
          </Select>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, onSale: e.target.value })
            }
          >
            <option value="false">Put on Sale</option>
            <option value="true">Yes On Sale</option>
            <option value="false">Not On Sale</option>
          </Select>

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
              "Upload Logo"
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

        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Create Now
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
        {publishSuccess && <Alert color={"failure"}>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
