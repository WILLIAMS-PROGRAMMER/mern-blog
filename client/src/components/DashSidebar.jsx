import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiBookOpen, HiDocumentText, HiUser, HiOutlineUserGroup, HiEye, HiAnnotation} from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"; //useEffect is for performing side effects in your function components
import { useSelector } from 'react-redux'; // useselector is for accessing the state of the store
import { signoutSuccess } from '../redux/user/userSlice'; // import the signoutSuccess action
import { useDispatch } from 'react-redux'; // useDispatch is for dispatching actions


export default function DashProfile() {
    const dispatch = useDispatch(); // this is for dispatching actions

    //esto es para saber la fecha de creacion del usuario y de actualizacion
    const { currentUser } = useSelector((state) => state.user); // this is for accessing the state of the store
    const createdAt = currentUser.createdAt;
    const updatedAt = currentUser.updatedAt;

    // Convertir la cadena de fecha a un objeto Date de JavaScript
    const dateObject1 = new Date(createdAt);
    const dateObject2 = new Date(updatedAt);

    // Opciones para el formato de fecha
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    // Formatear la fecha de manera más amigable
    const formattedDate1 = dateObject1.toLocaleDateString('es-ES', options);
    const formattedDate2 = dateObject2.toLocaleDateString('es-ES', options);
    ///////////////////////////////////////////////////////////////////////////////////////

    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl) {
        setTab(tabFromUrl);
        }
    }, [location.search])

    // this is for signout the user from the application
    const handleSignOut = async () => {
        try {
             const res = await fetch('/api/user/signout', { 
                 method: 'POST', // send a post request
             });
             if(!res.ok) {
                console.log('error signing out'); // log the error
             } else {
                 dispatch(signoutSuccess()); // dispatch the signoutSuccess action
             }
        } catch (error) {
             console.log('error signing out');
        }
      };

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to="/dashboard/?tab=profile">
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark" as='div'>Profile</Sidebar.Item>
                </Link>

                {currentUser.isAdmin && (
                <Link to="/dashboard/?tab=posts">
                    <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>Posts</Sidebar.Item>
                </Link>
                
                )}

                
                {currentUser.isAdmin && (
                <>
                    <Link to="/dashboard/?tab=users">
                        <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>Users</Sidebar.Item>
                    </Link>

                    <Link to="/dashboard/?tab=comments">
                        <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>Comments</Sidebar.Item>
                    </Link>
                </>
                
                )}

                <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut} >Sign out</Sidebar.Item>
                
                <Sidebar.Item icon={HiBookOpen} className='font-light'>Cuenta creada el: <br />
                     <span className=' text-sm'>{formattedDate1}</span>
                </Sidebar.Item>
                <Sidebar.Item icon={HiEye} className='font-light'>Cuenta actualizada el: <br />
                     <span className=' text-sm'>{formattedDate2}</span>
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

// //br is for line break
