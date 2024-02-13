import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom" // useParams is a hook that allows you to access the URL parameters of the page

export default function PostPage() {

    const {postSlug} = useParams(); // this is for accessing the URL parameters of the page
    const [loading, setLoading] = useState(true); // this is for loading the page
    const [error, setError] = useState(false); // this is for handling errors
    const [post, setPost] = useState(null); // this is for setting the post

    useEffect(() => {
        const fetchPost = async () => {
            try {
               setLoading(true);
               const res = await fetch(`/api/post/getposts?slug=${postSlug}`); // fetch the post, despues de ? es el query string
                const data = await res.json();
        
                if(!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                } else {
                    setPost(data.posts[0]); // [0] porque el query devuelve un array , y solo queremos el primer elemento
                    setLoading(false);
                    setError(false);
                }
            
            } catch (error) {
              setError(true);
              setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug])

    if(loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl' />
        </div>
    );
  
    
  return <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
        <Link to={`/search?category=${post.category}`} className="self-center mt-5">
            <Button color="gray" pill size='xs'>{post && post.category}</Button>
        </Link>
        <img src={post.image} alt={post.title} className=" mt-10 p-3 max-h-[600px] w-full object-cover " />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">{(post.content.length/400).toFixed(0)} mins read</span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>

        </div>
    </main>
  
}
