import {Label, TextInput,Accordion, Button, Alert, Spinner, Banner, Navbar} from "flowbite-react";
import { useSelector } from 'react-redux';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import OAuth from "../components/OAuth";
import Logo from '../assets/logo.png'
import OAuth from "../component/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out All input field!");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const resp = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!resp.ok) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }
      const data = await resp.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      console.log("Response:", data);
      setLoading(false);
      setErrorMessage(null);
      if (resp.ok) {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.message);
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="pt-20"  >
     <div className="min-h-screen " >
         <div className="flex p-3  max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left */}
          <div className="flex-1">
            <Link
              to="/"
              className="font-bold text-3xl sm:text-4xl dark:text-white"
            >
              <div className="flex   items-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32  "
                /> 
                <span className="text-xl  text-gray-500 font-light">
                  Create Free Shop
                </span> 
              </div>
            </Link>
            <p className="text-small mt-5">
              This is the plateform where you can sell and purchese garments,
              and can provide and get tailoring services.
            </p>
          </div>

          {/* Right */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  placeholder="Email"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                className=""
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner className="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            <OAuth/>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to="/signin" className="text-blue-500">
                Sign In
              </Link>
            </div>
            {errMessage && (
              <Alert className="mt-5 " color="failure">
                {errMessage}
              </Alert>
            )}
          </div>
        </div>
       </div>
       </div>
   );
}
