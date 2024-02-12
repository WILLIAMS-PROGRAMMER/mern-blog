import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";

export default function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
     const urlParams = new URLSearchParams(location.search);
     const tabFromUrl = urlParams.get('tab');
     if(tabFromUrl) {
       setTab(tabFromUrl); // Set the tab state to the tab from the URL
     }
  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
          {/* Sidebar */}
          <DashSidebar />
      </div>
        {/* Right side */}
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
      </div>
  )
}
