import React from 'react'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import CreateBlog from './pages/CreateBlog'
import Dashboard from './pages/Dashboard'
import YourBlog from './pages/YourBlog'
import BlogView from './pages/BlogView'
import Footer from './components/Footer'
import About from './pages/About'
import Comments from './pages/Comments'
import UpdateBlog from './pages/UpdateBlog'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AuthBootstrap from './components/AuthBootstrap'
import SearchList from './pages/SearchList'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><Home /></>
  },
  {
    path: "/blogs",
    element: <><Navbar/><Blog /></>
  },
  {
    path: "/about",
    element: <><Navbar/><About /></>
  },
  {
    path: "/search",
    element: <><Navbar/><SearchList/></>
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar/><BlogView /></>
  },
  {
    path: "/write-blog",
    element: <><Navbar/><ProtectedRoute><CreateBlog /></ProtectedRoute></>
  },
 
  {
    path: "/profile",
    element: <><Navbar/><ProtectedRoute><Profile /></ProtectedRoute></>
  },


  // {
  //   path: "write-blog/:blogId",
  //       element: <><Navbar/><CreateBlog /></>
  // },
  // {
  //   path: "/dashboard",
  //   element: <><Navbar/><Dashboard /></>
  // },


  {
    path:"/dashboard",
    element: <><Navbar/><ProtectedRoute><Dashboard/></ProtectedRoute></>,
    children:[
      {
        path: "write-blog",
        element:<><CreateBlog/></>
      },
      {
        path: "write-blog/:blogId",
        element: <><UpdateBlog /></>
      },
      {
        path: "your-blog",
        element:<YourBlog/>
      },
      {
        path: "comments",
        element:<Comments/>
      },
      {
        path: "profile",
        element:<Profile/>
      },
      
      
    ]
   },
  {
    path: "/signup",
    element: <><Navbar/><GuestRoute><Signup /></GuestRoute></> 
  },
  {
    path: "/login",
    element: <><Navbar/><GuestRoute><Login /></GuestRoute></>
  },
  {
    path: "/forgot-password",
    element: <><Navbar/><GuestRoute><ForgotPassword /></GuestRoute></>
  },
])

const App = () => {
  return (
    <>
      <AuthBootstrap />
      <RouterProvider router={router} />
    </>
  )
}

export default App
