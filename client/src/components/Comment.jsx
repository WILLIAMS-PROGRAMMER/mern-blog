import { useEffect, useState } from "react"
import moment from "moment";

export default function Comment({comment}) { // commetn es un prop que se pasa desde CommentSection.jsx
    const [user, setUser] = useState({}); // user es un estado que se inicializa como un objeto vacio
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`); // fetch the get user endpoint
                const data = await res.json(); // parse the response body
                if(res.ok) {
                    setUser(data); // set the user state to the response body
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
            <p className="text-gray-500 dark:text-gray-200 mb-2 max-w-[340px]">{comment.content}</p>
        </div>
    </div>
  )
}
