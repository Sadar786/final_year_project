import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redex/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
// import OAuth from "../components/OAuth";
import Logo from "../assets/logo.png";
import {  shopIsNotCreated, signInDone, deleteShopSuccess } from "../redex/shop/shopSlice";
import { shopIsCreated } from "../redex/shop/shopSlice";
import OAuth from "../component/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage , currentUser} = useSelector((state) => state.user);
  const {myShop} = useSelector((state)=> state.shop)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
    
 
  
  const setShop = () => {
    setTimeout(async () => {
      if (!currentUser || !currentUser.haveAShop) {
        console.log("currentUser is null or missing _id");
        return;
      }
  
      try {
        console.log("Fetching shop for user ID:", currentUser._id);
        const res = await fetch(`/api/post/getPost/${currentUser._id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUser.token}`, // Assuming the token is stored in currentUser
          }
        });
        const data = await res.json();
        if (!res.ok) {
          console.log("Shop not found: " + data.message);
          dispatch(deleteShopSuccess())
          return;
        }
        console.log("user data after signin" + data)
        dispatch(shopIsCreated(data));
        console.log("my shop after signIn", data);
        navigate("/")
      } catch (error) {
        console.log("Error retrieving shop: " + error.message);
        dispatch(deleteShopSuccess())
      }
    }, 2000);
  };
  
  
  useEffect(() => {
    if (currentUser) {
      setShop();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please provide all the fields."));
    }

    try {
      dispatch(signInStart());
      const resp = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        dispatch(signInFailure(errorData.message));
        return;
      }
      const data = await resp.json();
      if (data.success === false) {
        dispatch(signInFailure(data.errMessage));
        return;
      }
      console.log("Response:", data);
      dispatch(signInSuccess(data));
      dispatch(signInDone());
      setShop();
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
      console.error("Fetch error:", err);
    }
  };

  const errorDisapear = () => {
    dispatch(signInStart());
  };
  return (
    <div className="pt-20">
      <div className="min-h-screen  dark:bg-[rgb(16, 23, 42)]">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
                  className="w-24  sm:w-30 sm:h-30  "
                />{" "}
                <span className="text-xl  text-gray-500 font-light">
                  Create Free Shop
                </span>{" "}
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
                <Label value="Your Email" />
                <TextInput
                  type="text"
                  placeholder="Email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={formData.password}
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
                  "Sign In"
                )}
              </Button>
              <OAuth onClick={errorDisapear}/>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>don't have an account?</span>
              <Link to="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5 " color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
