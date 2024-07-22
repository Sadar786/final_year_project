import { Alert, Button, Select, TextInput, FileInput, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FaStar } from "react-icons/fa";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";

export default function AddOrder() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [order, setOrder] = useState([]);
  const [payment, setPayment] = useState({});
  const { products } = location.state || {}; // Get the products data from state
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      alert("You need to login or sign up first");
      navigate("/signin");
      return;
    }
  }, [currentUser, navigate]);

  const formWithIds = {
    ...formData,
    shopId: products?.shopId,
    customer: currentUser?._id,
    items: products,
    userId: currentUser?._id,
  };

  console.log(products);
  const goHome = () => {
    setTimeout(() => {
      navigate("/search");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod !== "cashOnDelivery" && !imageUploaded) {
      alert("Please upload your payment screen shot first");
      return;
    }
    try {
      const res = await fetch("/api/order/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formWithIds),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Error occurred:", data.message);
        setPublishError(
          "Your Order does not Completed Some thing went wrong: " + data.message
        );
        return;
      }

      const data = await res.json();
      console.log("Order added successfully:", data);
      setOrder(data);
      setPublishSuccess("Your Order is Completed Now");
      goHome();
    } catch (error) {
      console.error("Error in submitting:", error); // Use console.error for error logs
      setPublishError("Something went wrong, Order not added");
    }
  };

  if (!products) {
    console.log("products is not found");
    return null;
  } else {
    console.log("the products received: " + JSON.stringify(products));
  }

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
      setImageUploaded(true);
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl border my-5 rounded-md dark:bg-slate-800 bg-gray-100 dark:text-slate-300 mx-auto min-h-screen">
      <h1 className="text-center text-xl sm:text-2xl my-7 font-semibold border rounded-md sm:p-2 dark:bg-slate-800 bg-gray-100 dark:text-slate-300 text-slate-700">
        Complete your Order
      </h1>
      <div className="flex justify-center mb-10">
        <Card
          className="max-w-sm gap-4"
          imgAlt="Picture not available"
          imgSrc={products.image}
        >
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {products.name}
            </h5>
            <div className="flex gap-1">
              <FaStar className="mt-1 text-yellow-200 mr-1" size={15} />
              <FaStar className="mt-1 text-yellow-200 mr-1" size={15} />
              <FaStar className="mt-1 text-yellow-200 mr-1" size={15} />
              <FaStar className="mt-1 text-yellow-200 mr-1" size={15} />
              <FaStar className="mt-1 text-yellow-200 mr-1" size={15} />
            </div>
          </div>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {products.description}
          </h5>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {products.price}
            </span>
            <span className="rounded-lg dark:bg-slate-700 p-5">Available</span>
          </div>
        </Card>
      </div>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Select
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData({ ...formData, paymentMethod: e.target.value })
          }
          required
        >
          <option value="">Select Payment Method</option>
          <option value="cashOnDelivery">Cash on delivery</option>
          <option value="easypaisa">Easypaisa</option>
          <option value="bank">Bank</option>
        </Select>

        <div className="flex flex-col gap-2 md:flex-row">
          <TextInput
            type="text"
            placeholder="Provide Full Address"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, deliveryAddress: e.target.value })
            }
          />
        </div>
        <p className={`text-red-300 font-semibold italic`}>
          If you choose to Pay through Bank or Easypaise, then upload the
          screenshot of the payment. Admin will verify and approve your Order.
        </p>
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
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <CircularProgressbar
                className="w-20"
                value={imageUploadProgress}
                text={`${imageUploadProgress}%`}
              />
            ) : (
              "Upload Snapshot"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color={"failure"}>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="products image"
            className="w-full h-72 object-cover"
          />
        )}

        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Order Now
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
        {publishSuccess && <Alert color={"success"}>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
