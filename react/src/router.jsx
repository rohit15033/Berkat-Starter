import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/layouts/DefaultLayout.jsx";
import GuestLayout from "./components/layouts/GuestLayout.jsx";
import Login from "./views/Authentication/Login.jsx";
import NotFound from "./views/Error/NotFound.jsx";
import Signup from "./views/Authentication/Signup.jsx";
import Users from "./views/Users/Users.jsx";
import UserForm from "./views/Users/UserForm.jsx";
import Appointments from "./views/Appointment/Appointments.jsx";
import AppointmentForm from "./views/Appointment/AppointmentForm.jsx";
import Customers from "./views/Customer/Customers.jsx";
import CustomerForm from "./views/Customer/CustomerForm.jsx";
import Invoices from "./views/Invoice/Invoices.jsx";
import InvoicesForm from "./views/Invoice/InvoicesForm.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/users"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/appointments',
        element: <Appointments />
      },
      {
        path:'/appointments/new',
        element: <AppointmentForm  key="appointmentCreate" />
      },
      {
        path:'/appointments/:id',
        element: <AppointmentForm  key="appointmentUpdate" />
      },
      {
        path: '/customers',
        element: <Customers />
      },
      {
        path:'/customers/new',
        element: <CustomerForm  key="customersCreate" />
      },
      {
        path:'/customers/:id',
        element: <CustomerForm  key="customersUpdate" />
      },
      {
        path: '/invoices',
        element: <Invoices />
      },
      {
        path:'/invoices/new',
        element: <InvoicesForm key="invoicesCreate" />
      },
      {
        path:'/invoices/:id',
        element: <InvoicesForm key="invoicesUpdate" />
      }

      // {
      //   path: '/inventory',
      //   element: <Inventory />
      // },
      // {
      //   path:'/inventory/new',
      //   element: <CustomerForm  key="customersCreate" />
      // },
      // {
      //   path:'/inventory/:id',
      //   element: <CustomerForm  key="customersUpdate" />
      // }
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
