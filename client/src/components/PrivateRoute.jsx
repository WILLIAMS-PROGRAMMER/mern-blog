import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user) // this is for accessing the state of the store
  return currentUser ? <Outlet/> : <Navigate to='/sign-in' /> //navigate is for redirecting the user to a different route
  //outlet is for rendering the nested routes
}
