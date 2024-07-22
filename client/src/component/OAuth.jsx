import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInFailure, signInSuccess } from '../redex/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleClickOnGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/googleAuth',{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoURL: resultFromGoogle.user.photoURL,
        }),
      })
      const data = await res.json()
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate("/")
      }
      else{
        dispatch(signInFailure("data not save in our database !" + data.message))
      }
      console.log("User signed in with Google:", resultFromGoogle.user);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      dispatch(signInFailure("error from catch statement: " + error.message))
    }
  };
  return (
    <Button gradientDuoTone='pinkToOrange' outline type='button' onClick={handleClickOnGoogle}>
          <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
          Continou with Google.
    </Button>
  )
}
