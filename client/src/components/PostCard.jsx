import {Link} from "react-router-dom"; // Link is a component that allows you to navigate to a different route

export default function PostCard({post}) { // this is a functional component that takes a prop called post
  return (
    <div className="group relative w-full border h-[400px] overflow-hidden rounded-lg sm:w-[360px] border-teal-500 hover:border-2 transition-all">
        <Link to = {`/post/${post.slug}`}> {/* this is a Link component that takes you to the post page */}
            <img src={post.image} alt={post.title} className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20 " /> {/* this is an image */}
        </Link>
        <div className="p-3 flex flex-col gap-2">
            <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
            <span className="italic text-sm">{post.category}</span>
            <Link to={`/post/${post.slug}`} className="z-10  group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">Read article</Link> {/* this is a Link component that takes you to the post page */}
        </div>
    </div>
  )
}
