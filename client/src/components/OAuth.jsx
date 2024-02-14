import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {  SignInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch(); // this is the hook that we use to dispatch actions to the store
    // Hooks for navigation (to redirect the user to another page)
    const navigate = useNavigate();

    const auth = getAuth(app); // this is the auth object that we use to sign in with Google ,app is the firebase app that we imported from firebase.js
    const handleGoogleClick =  async () => {
       const provider = new GoogleAuthProvider(); // this is the provider that we use to sign in with Google
       provider.setCustomParameters({ prompt: 'select_account' }); // this is the custom parameter that we use to prompt the user to select an account
       try {
            const result = await signInWithPopup(auth, provider); // this is the function that we use to sign in with Google
           const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: result.user.displayName,
                    email: result.user.email,
                    googlePhotoURL: result.user.photoURL,
                 }),
              });
              const data = await res.json();
              if(res.ok) {
                dispatch(SignInSuccess(data));
                navigate('/');
              }
             
       } catch (error) {
            console.error('Error signing in with Google', error);
       }
    }

  return (
    <Button type="button" gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2' />
        Continue with Google
    </Button>
  )
}
