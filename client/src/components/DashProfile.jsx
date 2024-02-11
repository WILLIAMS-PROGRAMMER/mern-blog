import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

//REACT CIRCULAR PROGRESSBAR
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
//REDUX para actualizar el usuario, su email,su username, su contraseña y su foto de perfil
import { updateStart, updateSuccess,updateFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function DashProfile() {

    const {currentUser} = useSelector(state => state.user); // this is for accessing the state of the store
    const [imageFile, setImageFile] = useState(null); // this is for storing the image file
    const [imageFileURL, setImageFileURL] = useState(null); // this is for showing the image
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // this is for showing the progress bar
    const [imageFileUploadError, setImageFileUploadError] = useState(null); // this is for showing the error message
    const [imageFileUploading, setImageFileUploading] = useState(false); // this is for showing the progress bar
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // this is for showing the success message
    const [updateUserError, setUpdateUserError] = useState(null); // this is for showing the error message
    const [formData, setFormData] = useState({});  // create a state to store the form data

    const filePickerRef = useRef();// create a reference to the input field

    const dispatch = useDispatch(); // this is for accessing the dispatch function

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file); // get the file from the input field and set it to the state
            setImageFileURL(URL.createObjectURL(file)); // get the file url and set it to the state
        }
    };


    useEffect(() => {
        if(imageFile) {
           uploadImage();
        }
    }, [imageFile]); // when the imageFile state changes, run the function

    const uploadImage = async () => {
        setImageFileUploading(true); // set the imageFileUploading state to true
        setImageFileUploadError(null);
        const storage = getStorage(app); // get the storage instance from the app
        const fileName = new Date().getTime() + imageFile.name; // create a unique file name
        const storageRef = ref(storage, fileName); // create a reference to the storage
        const uploadTask = uploadBytesResumable(storageRef, imageFile); // create an upload task

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0)); // get the upload progress and set it to the state, tofixed is used to round the number to 0 decimal places
            },
            (error) => {
                    setImageFileUploadError('Could not upload the image, your file must be less than 2MB. Please try again.');
                    setImageFileUploadProgress(null);
                    setImageFile(null);
                    setImageFileURL(null);
                    setImageFileUploading(false); // set the imageFileUploading state to false
            },
            () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileURL(downloadURL);
                        setFormData({...formData, profilePicture: downloadURL});
                        setImageFileUploading(false); // set the imageFileUploading state to false
                    });
            }, 
        );

    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) => { //async because we are using await
        e.preventDefault(); // prevent the default form submission
        //console.log(Object.keys(formData));
        setUpdateUserError(null); // reset the error message
        if(Object.keys(formData).length === 0 ) {
            setUpdateUserError('Please fill in the form to update your profile!'); // set the error message
            return;
        }; // if the form data is empty, return
        
        if(imageFileUploading) {
            setUpdateUserError('Please wait for the image to finish uploading!'); // set the error message
            return;
        }; // if the image is uploading, return
        try {
            dispatch(updateStart()); // dispatch the updateStart action
            const res = await fetch(`/api/user/update/${currentUser._id}`, { 
                method: 'PUT', // send a put request
                headers: {
                    'Content-Type': 'application/json', // send the data as json
                },
                body: JSON.stringify(formData), // send the form data
            });
            const data = await res.json(); // get the response data
            if(!res.ok) {
                dispatch(updateFailure(data.message)); // dispatch the updateFailure action
                setUpdateUserError(data.message); // set the error message
            } else {
                dispatch(updateSuccess(data)); // dispatch the updateSuccess action
                setUpdateUserSuccess('Profile updated successfully!'); // set the success message
            }
        } catch (error) {
            dispatch(updateFailure('Something went wrong!')); // dispatch the updateFailure action
        }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-bold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

            <div onClick={() => filePickerRef.current.click()}  className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative'>
                {imageFileUploadProgress && (
                    <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{root:{width: '100%', height: '100%', position:'absolute',top:0, left:0}, path:{stroke:`rgba(62,152,199, ${imageFileUploadProgress / 100})`} }} />
                )}
                <img src={imageFileURL || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-55' } ` }/>
            </div>
            {imageFileUploadError &&  <Alert color='failure'>{imageFileUploadError}</Alert> }
           

            <TextInput type='text' onChange={handleChange} id='username' placeholder='username' defaultValue={currentUser.username}/>
            <TextInput type='email'  onChange={handleChange}  id='email' placeholder='email' defaultValue={currentUser.email}/>
            <TextInput type='password'  onChange={handleChange}  id='password' placeholder='we are not showing the password for security'/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>Save</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign out</span>
        </div>

        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>
        )}

        {updateUserError && (
            <Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>
        )}
    </div>
  )
}
