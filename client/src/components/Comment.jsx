import { useEffect, useState } from "react"
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({comment, onLike, onEdit, onDelete}) { // commetn es un prop que se pasa desde CommentSection.jsx
    const [user, setUser] = useState({}); // user es un estado que se inicializa como un objeto vacio
    const {currentUser} = useSelector(state => state.user); // useSelector es un hook de react-redux que permite acceder al estado de redux
    const [isEditing, setIsEditing] = useState(false); // isEditing es un estado que se inicializa como un booleano falso
    const [editedContent, setEditedContent] = useState(comment.content); // editedContent es un estado que se inicializa con el contenido del comentario
    console.log(currentUser,'currentUser'); // para comprobar que se esta obteniendo el usuario actual
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`); // fetch the get user endpoint
                const data = await res.json(); // parse the response body
                if(res.ok) {
                    setUser(data); // set the user state to the response body
                    console.log(currentUser,'currentUser'); 
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment]);

    console.log(user,'user'); // para comprobar que se esta obteniendo el usuario

    const handleEdit = () => {
       setIsEditing(true); // set the isEditing state to true
       //setEditedContent(comment.content); // set the editedContent state to the content of the comment
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, { // fetch the edit comment endpoint
                method: 'PUT', // send a PUT request
                headers: {
                    'Content-Type': 'application/json', // send the request body in JSON format
                },
                body: JSON.stringify({content: editedContent}) // send the edited content in the request body
            });
            const data = await res.json(); // parse the response body
            if(res.ok) {
                onEdit(comment, editedContent); // call the onEdit function with the updated comment
                setIsEditing(false); // set the isEditing state to false
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // const handleDelete = async () => {
     
    // };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className=" flex-shrink-0 mr-3">
            <img className="w-10 h-10 rounded-full bg-gray-200" src={user.profilePicture} alt={user.username} />
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
            </div>
            {isEditing ? (
                <>
                    <Textarea 
                        className="mb-2"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        maxLength='200'
                    />
                    <div className="flex justify-end gap-3 text-xs">
                        {editedContent && <Button type="button" size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>
                            Save
                        </Button>}
                        <Button type="button" size='sm' gradientDuoTone='purpleToBlue' outline onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </>
            ) :  (
                <>
                    <p className="text-gray-500 dark:text-gray-200 mb-2 max-w-[340px]">{comment.content}</p>
                    
                    <div className="flex items-center gap-3 text-xs border-t dark:border-gray-700 max-w-fit">
                        <button 
                            type="button"
                            onClick={() => onLike(comment._id)}
                            className={` hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) ? 'text-blue-500' : 'text-gray-400'}`}
                        >
                            <FaThumbsUp className="text-sm" />
                        </button>
                        <p className="text-gray-400">
                            {comment.numberOfLikes} {comment.numberOfLikes === 1 ? 'like' : 'likes'}
                        </p>
                        { // <> </> es un fragmento de react
                           currentUser &&
                            ((currentUser._id === comment.userId) || currentUser.isAdmin) && (
                                <>
                                    <button 
                                        type="button"
                                        className="text-gray-400 hover:text-blue-500"
                                        onClick={handleEdit}>
                                            Edit
                                    </button>

                                    <button 
                                    type="button"
                                    className="text-gray-400 hover:text-red-500"
                                    onClick={() => onDelete(comment._id)}>
                                        Delete
                                    </button>
                                </>
                            )
                        }
                    </div>
                </>
            )}
           

        </div>
    </div>
  )
}
