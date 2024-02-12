import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const {currentUser} = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdDelete, setUserIdDelete] = useState('');

  console.log(users);
  useEffect(() => { //useEffect se llama cuando el componente se monta y cada vez que currentUser._id cambia
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`);   //fetch es una funcion de javascript que hace peticiones http
        const data = await response.json();
       if(response.ok) {
          setUsers(data.users); //data.users viene del backend, es un array de usuarios, en usercontroller.js linea 10
          if(data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers(); //se llama la funcion
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await response.json();
      if(response.ok) {
        //...prev es el estado anterior, y ...data.posts es el nuevo estado
        setUsers((prev) => [...prev, ...data.users]); // data.posts viene del backend, es un array de posts,en postcontroller.js linea 40
        if(data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
      setShowModal(false);
    //   try {
    //       const response = await fetch(`/api/user/deleteuser/${userIdDelete}/${currentUser._id}`, {
    //           method: 'DELETE',
    //       });
    //       const data = await response.json();
    //       if(!response.ok) {
    //          console.log(data.message);
    //       } else {
    //           setUserPosts((prev) => prev.filter((post) => post._id !== postIdDelete)); //esto es para que se actualice el estado de userPosts sin recargar pagina
    //       }
    //   } catch (error) {
    //       console.log(error);
    //   }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                  <Table.HeadCell>Date created</Table.HeadCell>
                  <Table.HeadCell>User profile image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users.map((user) => ( //map requieere una key unica, en este caso user._id
                <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>  
                            <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full m-auto" />    
                        </Table.Cell>
                        <Table.Cell>
                          {user.username}
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>): (<FaTimes className="text-red-500" />)}</Table.Cell>
                        <Table.Cell>
                            <span onClick={()=> {
                              setShowModal(true);
                              setUserIdDelete(user._id);
                            }} className="font-medium text-red-500 hover:underline cursor-pointer">
                                Delete
                            </span>
                        </Table.Cell>
                    
                    </Table.Row>
                </Table.Body>
              ))
              }

            </Table>
            {showMore && (
              <button onClick={handleShowMore} className="block mx-auto my-3 p-3 bg-teal-500 text-white rounded-md w-full">Show more</button>
            )}
          </>
        ) : (
          <p>Something went wrong,please log out and enter again!!!</p>
        )}

    
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                    <div className="flex justify-center gap-4">
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    </div>
  )
}
