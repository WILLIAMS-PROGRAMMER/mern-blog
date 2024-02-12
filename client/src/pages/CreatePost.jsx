import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploladProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const handleUploadImage = async () => {
        try {
            if(!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null); // Reset the error
            const storage = getStorage(app); // Get the storage service from firebase, app viene de firebase.js
            const fileName = new Date().getTime() + '-' + file.name; // Create a unique name for the file
            const storageRef = ref(storage, fileName); // Create a storage reference
            const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0)); // Set the progress ,no decimal
                },
                (error) => {
                    setImageUploadError('An error occurred while uploading the image');
                    setImageUploadProgress(null); // Reset the progress
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // Get the download URL
                        setImageUploadProgress(null); // Reset the progress
                        setImageUploadError(null); // Reset the error
                        setFormData({...formData, image: downloadURL});
                    });
                }
            );
        } catch (error) {
            setImageUploadError('An error occurred while uploading the image');
            setImageUploadProgress(null); // Reset the progress
            console.log(error);
        }
    }

  return (
    <div
        className="p-3 max-w-3xl mx-auto min-h-screen"
    >
        <h1 className="text-center text-3xl my-7 font-bold">Create a post</h1>
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
                <Select>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="firebase">Firebase</option>
                    <option value="tailwindcss">Tailwincss</option>
                    <option value="vite">Vite</option>
                    <option value="flowbite">flowbite-react</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                <Button type="button" gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploladProgress} >
                    {imageUploladProgress ? (
                        <div className="w-16 h-16">
                            <CircularProgressbar value={imageUploladProgress} text={`${imageUploladProgress}%`} />
                        </div>
                    ) : 'Upload Image'}
                </Button>
            </div>
            
           {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
           
           { formData.image && ( // mostrar la imagen que se esta subiendo
              <img src={formData.image} alt="Uploaded" className="w-full h-70 object-cover" />   //object-cover para que la imagen no se deforme 
            )

           }

            <ReactQuill theme="snow" placeholder="Write something..." className="h-72 mb-12" required />

            <Button type="submit" gradientDuoTone='purpleToPink' disabled={imageUploladProgress}>
                {imageUploladProgress ? (
                        <div className="w-8 h-8">
                            <CircularProgressbar value={imageUploladProgress} text={`${imageUploladProgress}%`} />
                        </div>
                ) : 'Publish'}
            </Button>
        </form>
    </div>
  )
}
