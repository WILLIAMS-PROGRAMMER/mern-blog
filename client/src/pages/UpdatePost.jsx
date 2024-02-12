import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import {useSelector } from "react-redux";

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploladProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const { postId } = useParams(); // Get the postId from the URL

    const navigate = useNavigate();
    const currentUser = useSelector(state => state.user.currentUser);

    useEffect( () => { //esto es de update post, para que se cargue el post que se quiere editar
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`); // Get the post by its ID
                // despues de ? , viene el query string, que es el postId
                const data = await res.json();
                if(!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message); // Set the error message
                    return;
                }
                if(res.ok) {
                    setPublishError(null); // Reset the error message
                    setFormData(data.posts[0]); // Set the form data with the post data
                }
            }
            fetchPost();
        } catch (error) {
            console.log(error);
        }
    }, [postId]);

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
                        setFormData({...formData, image: downloadURL}); // Set the image URL in the form data
                    });
                }
            );
        } catch (error) {
            setImageUploadError('An error occurred while uploading the image');
            setImageUploadProgress(null); // Reset the progress
            console.log(error);
        }
    }

    //en esta funcion ya nos cominicamos con el backend, para poder guardar el post
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission, refresh the page
        try {
            const response = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, { // Update the post by its ID
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data.message);
            if(!response.ok) {
                setPublishError(data.message); //data.message se obiene del backend con next en post.controller.js
                return;
            } else {
                setPublishError(null); // Reset the error of the previous request
                navigate(`/post/${data.slug}`); // Redirect to the home page,data.slug es podsible gracias a res.status(201).json(savedPost); // en post.controller.js
                //data.slug se obtiene del backend con next en post.controller.js, slug es el titulo de la publicacion pero con guiones
            }

        } catch (error) {
            setPublishError(data.message);
        }
       
    }

  return (
    <div
        className="p-3 max-w-3xl mx-auto min-h-screen"
    >
        <h1 className="text-center text-3xl my-7 font-bold">Update a post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" placeholder="Title" required id="title" className="flex-1" onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} />
                <Select onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
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

            <ReactQuill value={formData.content} onChange={(value) => setFormData({...formData, content: value})} theme="snow" placeholder="Write something..." className="h-72 mb-12" required />

            <Button type="submit" gradientDuoTone='purpleToPink' disabled={imageUploladProgress}>
                {imageUploladProgress ? (
                        <div className="w-8 h-8">
                            <CircularProgressbar value={imageUploladProgress} text={`${imageUploladProgress}%`} />
                        </div>
                ) : 'Save changes'}
            </Button>

            {
                publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>
            }
        </form>
    </div>
  )
}
