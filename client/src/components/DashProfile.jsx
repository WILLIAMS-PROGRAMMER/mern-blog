import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

//REACT CIRCULAR PROGRESSBAR
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {

    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const filePickerRef = useRef();// create a reference to the input field

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
            },
            () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileURL(downloadURL);
                    });
            }, 
        );

    };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

            <div onClick={() => filePickerRef.current.click()}  className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative'>
                {imageFileUploadProgress && (
                    <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{root:{width: '100%', height: '100%', position:'absolute',top:0, left:0}, path:{stroke:`rgba(62,152,199, ${imageFileUploadProgress / 100})`} }} />
                )}
                <img src={imageFileURL || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-55' } ` }/>
            </div>
            {imageFileUploadError &&  <Alert color='failure'>{imageFileUploadError}</Alert> }
           

            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
            <TextInput type='password' id='password' placeholder='password' defaultValue="**************"/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>Save</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign out</span>
        </div>
    </div>
  )
}
