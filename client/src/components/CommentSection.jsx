import {  Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function CommentSection({postId}) { //postId es un prop que se pasa desde PostPage.jsx

    const {currentUser} = useSelector(state => state.user); // useSelector es un hook de react-redux que permite acceder al estado de redux
    const [comment, setComment] = useState(''); // comments es un estado que se inicializa como un array vacio
    const [error, setError] = useState(''); // error es un estado que se inicializa como un string vacio
    const [comments, setComments] = useState([]); // comments es un estado que se inicializa como un array vacio
    const navigate = useNavigate(); // useNavigate es un hook de react-router-dom que permite navegar a una ruta
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(''); // comments es un estado que se inicializa como un array vacio

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent the default behavior of the form
        if(comment.length > 200) {
            return;
        }
        try {
            const res = await fetch('/api/comment/create', { // fetch the create comment endpoint
                method: 'POST', // send a POST request
                headers: {
                    'Content-Type': 'application/json', // send the request body in JSON format
                },
                body: JSON.stringify({content: comment, userId: currentUser._id, postId}) // send the content, userId, and postId in the request body
            });
            const data = await res.json(); // parse the response body
            if(res.ok) {
                setComment(''); // clear the comment input field
                setError(''); // clear the error state
                setComments([data, ...comments]); // add the new comment to the comments state
            } else {
                setError(data.message); // set the error state to display an error message
            }
        } catch (error) {
            setError(error.message); // set the error state to display an error message
        }  
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`); // fetch the get comments endpoint
                const data = await res.json(); // parse the response body
                if(res.ok) {
                    setComments(data); // set the comments state to the response body
                } else {
                    setError(data.message); // set the error state to display an error message
                }
            } catch (error) {
                setError(error.message); // set the error state to display an error message
            }
        }
        getComments();
    }, [postId]); // useEffect se ejecuta cuando postId cambia

    console.log(comments);

    const handleLike = async (commentId) => {
        try {
            if(!currentUser) { // if there is no user, return (do nothing
                navigate('/sign-in'); // navigate to the sign in page
                return;
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, { // fetch the like comment endpoint
                method: 'PUT', // send a PUT request
            });
            const data = await res.json(); // parse the response body
            if(res.ok) {
                setComments(comments.map(comment => comment._id === commentId ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.numberOfLikes
                } : comment)); // update the comments state with the updated comment
            } else {
                setError(data.message); // set the error state to display an error message
            }
        } catch (error) {
            setError(error.message); // set the error state to display an error message
        }
    };
    console.log(comments,'comments');

    const handleEdit = async (comment, editedContent) => {
        setComments(comments.map(c => c._id === comment._id ? {...c, content: editedContent} : c));
    };

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if(!currentUser) { navigate('/sign-in'); return;}

            const res = await fetch(`/api/comment/deleteComment/${commentId}`, { // fetch the delete comment endpoint
                method: 'DELETE', // send a DELETE request
            });
            const data = await res.json(); // parse the response body
            if(res.ok) {
              setComments(comments.filter(comment => comment._id !== commentId)); // remove the deleted comment from the comments state
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentUser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p className='dark:text-white'>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="image of profile" />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 dark:text-cyan-200 hover:underline' >
                    @{currentUser.username}
                </Link>
            </div>
        ) : (
            <div className='text-sm text-gray-500 dark:text-gray-200 my-5 flex gap-1'>
                You must be signed in to comment.
                <Link to={'/sign-in'} className='text-blue-500 hover:underline' >
                    Sign in
                </Link>
            </div>
        )}
        {currentUser && (
            <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
               <Textarea  placeholder='Write a comment...' rows='3' maxLength='200' onChange={(e)=> setComment(e.target.value) } value={comment}  />
               <div className='flex justify-between items-center mt-5'>
                    <p className='text-gray-500 dark:text-gray-200 text-xs'>{200- comment.length} characters remaining</p>
                    <Button gradientDuoTone='purpleToBlue' outline type='submit'>Comment</Button>
               </div>

               {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
            </form>    
        )}

        {comments.length == 0 ? (
            <p className='text-sm my-5'>Be the first user to comment!!!</p>
        ) :
        ( 
            <>
                <div className="text-sm my-5 flex items-center gap-1">
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {comments.map(comment => (
                    <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => { setShowModal(true); setCommentToDelete(commentId);  }} />
                ))}
            </>


        )}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                    <div className="flex justify-center gap-4">
                        <Button color='failure' onClick={()=>handleDelete(commentToDelete)}>Yes, I'm sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

 // <>  React.Fragment
//value={comment} es para actualizar en el frontendel valor de commetn para que el ususrio tenga mjor experinecia