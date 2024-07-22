import {
  Alert,
  Button,
  Select,
  TextInput,
  FileInput,
  Card,
} from "flowbite-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../firebase.js";

export default function AddOrder() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
   const { currentUser } = useSelector((state) => state.user);
   const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
   const [measurementForm, setMeasurementForm] = useState({});
  const {shopId} = useParams();



  const formWithIds = {
    ...formData,
    shopId: shopId,
     customerId: currentUser._id,
    userId: currentUser._id,
    customerEmail: currentUser.email,
    measurementForm,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod !== "cashOnDelivery" && !imageUploaded) {
      alert("Please upload your payment screen shot first");
      return;
    }
    try {
      const res = await fetch("/api/tailoring/createTailoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formWithIds),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Error occurred:", data.message);
        setPublishError(
          "Your Order does not Completed Some thing went wrong: " + data.message
        );
        return;
      }

      console.log("Order added successfully:", data);
       setPublishSuccess("Your Order is Completed Now");
      if(currentUser.haveAShop){
        
        
      }else{
        alert("Your measurement is submitted successfully")
        navigate("/")
      }
      } catch (error) {
      console.error("Error in submitting:", error);
      setAddError("Something went wrong, Order not added");
    }
  };

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
          setImageUploadError("Image upload failed: " + error.message);
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
      console.error(error);
    }
  };

 

  return (
    <div className="p-3 max-w-3xl border my-5 rounded-md dark:bg-slate-800 bg-gray-100 dark:text-slate-300 mx-auto min-h-screen">
      <h1 className="text-center text-xl sm:text-2xl my-7 font-semibold border rounded-md sm:p-2 dark:bg-slate-800 bg-gray-100 dark:text-slate-300 text-slate-700">
        Complete your Tailoring Measurement
      </h1>

      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 md:flex-row mt-1">
          <TextInput
             type="text"
             placeholder="Your Full Name"
             required
             className="flex-1"
             onChange={(e) =>
               setFormData({ ...formData, customerName: e.target.value })
            }
          />
          <TextInput
             type="text"
             placeholder="Your Contact"
             className="flex-1"
             onChange={(e) =>
               setFormData({ ...formData, customerContact: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row mt-1">
          <TextInput
            type="address"
            placeholder="Provide Full Address"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, costumerAddress: e.target.value })
            }
          />
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
        </div>

        <h3 className="font-bold">Provide you Correct Measurement</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2 justify-between">
            <TextInput
              type="number"
              placeholder="Tailoring Price "
              className="flex-1"
              required
              value={formData.tailoringPrice}
              onChange={(e) =>
                setFormData({ ...formData, tailoringPrice: e.target.value })
              }
            />
            <Select
              value={measurementForm.ShirtLength}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, shirtLength: e.target.value })
              }
              required
            >
              <option value="">Shirt Lenght</option>
              {[...Array(20)].map((_, i) => (
                <option key={i + 35} value={i + 35}>
                  {i + 35}
                </option>
              ))}
            </Select>
         
          </div>
          <div className="flex gap-2 justify-between">
          <Select
              value={measurementForm.armLenght}
              onChange={(e) =>
                setMeasurementForm({
                  ...measurementForm,
                  armLenght: e.target.value,
                })
              }
              required
            >
              <option value="">Arm Lenght</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 12} value={i + 12}>
                  {i + 12}
                </option>
              ))}
            </Select>
            <Select
              value={measurementForm.ghera}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, ghera: e.target.value })
              }
            >
              <option value="">Ghera</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
            </div>
          <div className="flex gap-2 justify-between">
            <Select
              value={measurementForm.thera}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, thera: e.target.value })
              }
              required
            >
              <option value="">Thera</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 9} value={i + 9}>
                  {i + 9}
                </option>
              ))}
            </Select>
            <Select
              value={measurementForm.gala}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, gala: e.target.value })
              }
             >
              <option value="">Gala</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 justify-between">
            <Select
              value={measurementForm.chati}
              onChange={(e) =>
                setMeasurementForm({
                  ...measurementForm,
                  chati: e.target.value,
                })
              }
              required
            >
              <option value="">Chati</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 15}>
                  {i + 15}
                </option>
              ))}
            </Select>
            <Select
              value={measurementForm.qamar}
              onChange={(e) =>
                setMeasurementForm({
                  ...measurementForm,
                  qamar: e.target.value,
                })
              }
              required
            >
              <option value="">Qamar</option>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 15}>
                  {i + 15}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 justify-between">
          <Select
              value={measurementForm.side}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, side: e.target.value })
              }
              required
            >
              <option value="">Side</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
            <Select
              value={measurementForm.caf}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, caf: e.target.value })
              }
              required
            >
              <option value="">Caf</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 4} value={i + 4}>
                  {i + 4}
                </option>
              ))}
            </Select>
            </div>
          <div className="flex gap-2 justify-between">
          <Select
              value={measurementForm.front}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, front: e.target.value })
              }
              required
            >
                <option value="">Front</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 4} value={i + 4}>
                  {i + 4}
                </option>
              ))}
              
            </Select>
            <Select
              value={measurementForm.calor}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, calor: e.target.value })
              }
              required
            >
              <option value="">Calor</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 7} value={i + 7}>
                  {i + 7}
                </option>
              ))}
            </Select>
            </div>
          <div className="flex gap-2 justify-between">
           
            <Select
              value={measurementForm.shalwar}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, shalwar: e.target.value })
              }
              required
            >
              <option value="">Shalwar</option>
              {[...Array(20)].map((_, i) => (
                <option key={i + 27} value={i + 27}>
                  {i + 27}
                </option>
              ))}
            </Select>
            <Select
              value={measurementForm.paincha}
              onChange={(e) =>
                setMeasurementForm({ ...measurementForm, paincha: e.target.value })
              }
              required
            >
              <option value="">Paincha</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
         


          
          </div>
        </div>
        <p className="text-red-300 font-semibold italic">
          If you choose to pay through Bank or Easypaisa, then upload the
          screenshot of the payment. Admin will verify and approve your order.
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
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded payment screenshot"
            className="w-full h-72 object-cover"
          />
        )}

        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Measurement Done
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
        {publishSuccess && <Alert color={"success"}>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
