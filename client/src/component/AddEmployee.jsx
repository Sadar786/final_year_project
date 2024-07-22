import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useDebugValue, useState } from "react";
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

export default function AddEmployee() {
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({});
  const [addError, setAddError] = useState(null)
  const [addSuccuss, setSuccess] = useState(null)
  const navigate = useNavigate();
   const {currentUser} = useSelector((state) => state.user)
  const {myShop} = useSelector((state)=> state.shop)
  const [employee, setEmployee] = useState({})

  
  // const addEmployeeToShop = async () => {
  //   console.log(employee._id)
  //   const url = `/api/employee/addEmployeeToShop/${myShop._id}/${employee._id}`;
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ employee }), // Ensure 'employee' is correctly structured
  //   };
  
  //   try {
  //     const response = await fetch(url, options);
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to add employee to shop');
  //     }
  
  //     return response.json();
  //   } catch (error) {
  //     console.error('Error adding employee to shop:', error);
  //     // Handle error appropriately
  //   }
  // };
  

  const formWithIds = {
    ...formData,
    shopId: myShop._id,
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    try {
      const res = await fetch('/api/employee/createEmployee', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formWithIds)
      });
  
      // Check if the response is not ok
      if (!res.ok) {
        // Parse the response as JSON
        const data = await res.json();
        // Extract the error message from the response
        setAddError(data.message || 'Something went wrong');
        console.error("Error occurred:", data.message);  // Use console.error for error logs
        return;
      }
  
      // If the response is okay, parse the JSON
      const data = await res.json();
      console.log("Employee added successfully:", data);
      setSuccess("Added Successfully");
      setEmployee(data);
      navigate('/dashboard?tab=employee')
  
    } catch (error) {
      console.error('Error in submitting:', error);  // Use console.error for error logs
      setAddError("Something went wrong, Employee not added");
    }
  }
  


  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Employee</h1>

      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Employee Name"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <Select
          value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            required
            >
            <option >Select Type</option>
            <option value="saler">saler</option>
            <option value="tailor">tailor</option>
            <option value="hybrid">hybrid</option>
             
          </Select>
        </div>
        <div className=" flex  flex-col gap-2 md:flex-row">
        
        <TextInput
            type="number"
            placeholder="Saliary of the Employee"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
          />
        <TextInput
            type="text"
            placeholder="Phone Number"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        <TextInput
            type="text"
            placeholder="address"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
       
      
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Add Now
        </Button>
        
        {
          addSuccuss && (
            <Alert color={'success'}>{addSuccuss}</Alert>
          )
        }
        {
          addError && (
            <Alert color={'failure'}>{addError}</Alert>
          )
        }
      </form>
    </div>
  );
}
