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
import {useNavigate} from 'react-router-dom'
import { shopIsCreated,  } from "../redex/shop/shopSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { updateFaluire, updateStart, updateSuccess } from "../redex/user/userSlice.js";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null)
  const [publishSuccess, setPublishSucess] = useState(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user)

  useEffect(()=>{
    if(!currentUser){
      alert("First sing in or sign up bro")
      navigate('/signin')
      return;
    }
    if(currentUser.haveAShop){
      alert("Budy you have a shop you cant create another one")
      navigate("/dashboard")
      return;
     }
  },[])

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

  const makeUserShopOwner = async () =>{
    const haveAShop = { haveAShop: true }; // Ensure correct formatting for the body
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(haveAShop),
      });
      
      const data = await res.json();
      if (!res.ok) {
         dispatch(updateFaluire(data.message));
      } else {
        dispatch(updateSuccess(data));
       }
    } catch (error) {
      dispatch(updateFaluire(error.message));
     }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
        const res = await fetch('/api/post/CreatePost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Corrected 'Application/json' to 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        dispatch(shopIsCreated(data));
        console.log(data);
        if(!res.ok){
          setPublishError("Error: " + data.message)
          setPublishSucess(null)
          console.log("error occur: " + data.message)
          return;
         }
        if(res.ok){
          setPublishSucess("Your Post has been Published Successfully.")
          setPublishError(null)
           dispatch(shopIsCreated(data));
           await makeUserShopOwner();
           alert("your store is created successfully")
          navigate('/')

        }
    } catch (error) {
      setPublishError("Something went wrong")
        console.log('Error in submitting:', error); 

    }
}


  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Your Shop</h1>

      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Your Shop Name"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select catagory</option>
            <option value="Tailor">Tailor</option>
            <option value="Boutiue">Boutique</option>
            <option value="Hybrid">Hybrid </option>
              
          </Select>
        </div>
        <div className=" flex  flex-col gap-2 md:flex-row">
        
        <TextInput
            type="text"
            placeholder="Bank Account"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, bankAccount: e.target.value })
            }
          />
        <TextInput
            type="text"
            placeholder="Easypaisa or other"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, easypaisaAccount: e.target.value })
            }
          />
        <TextInput
            type="text"
            placeholder="location"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
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
        <TextInput onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
        type="text"
           className="h-20 mb-12"
          placeholder="description of your Shop"
          required
        />

        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Create Now
        </Button>
        {
          publishError && (
            <Alert color={'failure'}>{publishError}</Alert>
          )
        }
        {
          publishSuccess && (
            <Alert color={'success'}>{publishSuccess}</Alert>
          )
        }
      </form>
    </div>
  );
}
