import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        order: 'desc',
        category: 'uncategorized'
    });
    //console.log('sidebarData', sidebarData);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate(); 

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('order');
        const categoryFromUrl = urlParams.get('category');

        if(searchTermFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
            })       
        }

        if(sortFromUrl) {
            setSidebarData({
                ...sidebarData,
                order: sortFromUrl,
            })       
        }

        if(categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                category: categoryFromUrl,
            })       
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`); // ir a controoller post para ver los querys permimtidos
            if(!res.ok) {
                setLoading(false);
               return;
            }
            if(res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                console.log(sidebarData);
                setLoading(false);
                if(data.posts.length == 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPosts();

    }, [location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if(e.target.id === 'order') {
            setSidebarData({
                ...sidebarData,
                order: e.target.value
            })
        }
        if(e.target.id === 'category') {
            setSidebarData({
                ...sidebarData,
                category: e.target.value
            })
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('order', sidebarData.order);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`); // navigate to the search route
    };

    const handleShowMore = async () => {
            const numberOfPosts = posts.length;
            const startIndex = numberOfPosts;
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex', startIndex);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if(!res.ok) {
                return;
            }
            if(res.ok) {
                const data = await res.json();
                setPosts([...posts, ...data.posts]); // trae los posts y los agrega al final, los post anteriores se mantienen con ... y se agregan mas posts
                if(data.posts.length == 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }

    };

  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold" htmlFor="">Search Term:</label>
                    <TextInput placeholder="Search..." type="text" id="searchTerm" value={sidebarData.searchTerm} onChange={handleChange}/>
                </div>

                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold" htmlFor="">Sort:</label>
                    <Select onChange={handleChange} value={sidebarData.sort} id="order">
                        <option value='desc'>Latest</option>
                        <option value='asc'>Oldest</option>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold" htmlFor="">Category:</label>
                    <Select onChange={handleChange} value={sidebarData.category} id="category">
                        <option value='uncategorized'>Uncategorized</option>
                        <option value='reactjs'>Reactjs</option>
                        <option value='javascript'>Javascript</option>
                        <option value='firebase'>firebase</option>
                        <option value='vite'>vite</option>
                        <option value='tailwindcss'>tailwindcss</option>
                        <option value='flowbite'>flowbite-react</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>
                    Apply filters
                </Button>
            </form>
        </div>

        <div className="w-full">
            <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Post results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                    {
                        !loading && posts.length == 0 && (<p className="text-xl text-gray-500">
                            No posts found.
                        </p>)
                    }
                    {
                        loading && (<p className="text-xl text-gray-500">
                            Loading...
                        </p>)
                    }
                    {
                        !loading && posts.map((post, index) =>    
                            <PostCard key={index} post={post} />  
                        )
                    }
                    {
                        showMore && (
                            <button onClick={handleShowMore} className="hover:underline p-7 w-full bg-slate-50 text-black">
                                Show more
                            </button>
                        )
                    }

            </div>
        </div>
    </div>
  )
}
