import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom' // permite que un usuario navegue a través de la aplicación sin recargar la página
import React, { useEffect, useState } from 'react'
import {AiOutlineSearch} from 'react-icons/ai' // import the AiOutlineSearch icon
import {FaMoon, FaSun} from 'react-icons/fa' // import the FaMoon and FaSun icons
import { useSelector, useDispatch } from 'react-redux' // useselector is for accessing the state of the store
// import the useDispatch hook for dispatching an action to the store
import { toggleTheme } from '../redux/theme/themeSlice' // import the toggleTheme action for changing the theme
import { signoutSuccess } from '../redux/user/userSlice' // import the signoutSuccess action for signing out the user
import { useNavigate } from 'react-router-dom' // useNavigate is a hook from react-router-dom that allows you to navigate to a route

export default function Header() {
  const path = useLocation().pathname; //.pathname is a property of the location object that returns the path of the current url
  const location = useLocation(); // useLocation is a hook from react-router-dom that returns the location object
  const dispatch = useDispatch(); // this is for dispatching an action to the store
  const { currentUser } = useSelector((state) => state.user); // this is for accessing the state of the store
  const { theme } = useSelector((state) => state.theme); // this is for accessing the state of the store
  const navigate = useNavigate(); // useNavigate is a hook from react-router-dom that allows you to navigate to a route
  const [searchTerm, setSearchTerm] = useState(''); // this is for storing the search termS

  console.log('searchTerm', searchTerm); // log the search term
  useEffect(() => {
      const urlParams = new URLSearchParams(location.search); // create a new URLSearchParams object
      const searchTermFromUrl = urlParams.get('searchTerm'); // get the value of the search parameter
      if(searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl); // set the search term to the value of the search parameter
      }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
         const res = await fetch('/api/user/signout', { 
             method: 'POST', // send a post request
         });
         if(!res.ok) {
            console.log('error signing out'); // log the error
         } else {
             dispatch(signoutSuccess()); // dispatch the signoutSuccess action
             navigate('/sign-up'); // navigate to the home route
         }
    } catch (error) {
         console.log('error signing out');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search); // location.search is the query string of the current url
    urlParams.set('searchTerm', searchTerm); // set the value of the search parameter
    const searchQuery = urlParams.toString(); // convert the URLSearchParams object to a string
    navigate(`/search?${searchQuery}`); // navigate to the search route

  };

  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Williams</span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
              {theme === 'light' ? <FaSun /> :  <FaMoon />}
          </Button>
          {currentUser ? (
            <Dropdown arrowIcon={false} inline label={
              <Avatar
                alt='user avatar'
                img={currentUser.profilePicture}
                rounded
                status="online"
              />
            }>
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span> 
              </Dropdown.Header>

              <Dropdown.Header>
                <Link to={'/dashboard?tab=profile'}>
                   <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown.Header>

            </Dropdown>

          ):
              (
                <Link to="/sign-in" className=''>
                <Button gradientDuoTone='purpleToBlue' outline>
                  Sign In
                </Button>
              </Link>
              )
          }
         
          <Navbar.Toggle />
        </div>

           <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={'div'}>
              <Link to="/">
                  Home
              </Link>
            </Navbar.Link>

            <Navbar.Link active={path === "/about"} as={'div'}>
              <Link to="/about">
                  About
              </Link>
            </Navbar.Link>

            <Navbar.Link active={path === "/projects"} as={'div'}>
              <Link to="/projects">
                  Projects
              </Link>
            </Navbar.Link>

          </Navbar.Collapse>
    </Navbar>
  )
}
