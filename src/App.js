import React from 'react'
import './App.css'
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
  } from 'react-router-dom';

import LandingPage from './Pages/LandingPage/LandingPage'

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import LoginPage from './Pages/Login/LoginPage';
import RoomPage from './Pages/Rooms/RoomPage';
import Menu from './Pages/Menu/Menu';
import Services from './Pages/Services/Services';
import Dashboard from './Pages/Dashboard/Dashboard';
import Booking from './Pages/Booking/Booking';
import Guest from './Pages/Guest/Guest';

const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
        },
        {
          path:'/login',
          element: <LoginPage />
        },
        {
          path:'/rooms',
          element: <RoomPage />
        },
        {
            path:'/menu',
            element: <Menu />
        },
        {
            path:'/services',
            element: <Services />
        },
        {
          path:'/FD/dashboard/:employee_id',
          element: <Dashboard />
        },
        {
            path:'/booking',
            element: <Booking />
        },
          path:'/:employee_type/dashboard/:employee_id',
          element:<OthersDashboard />
        },
        {
          path:'/addGuest/:employee_id/:brn_id',
          element:<Guest/>
        }
      ],
    },
  ]);

function App() {
    return (
      <div>
        <RouterProvider router={router} />
      </div>
    );
  }

export default App