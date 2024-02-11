import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function OnlyAdminPrivateRoute() {
    const {currentUser} = useSelector((state) => state.user) // this is for accessing the state of the store
  return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in' /> //navigate is for redirecting the user to a different route
  //outlet is for rendering the nested routes, check app.jsx
}

//NOTA: se comprueba primero existe un usuario porque si no hay error al hacer sign out