import { createBrowserRouter, Navigate } from "react-router-dom";
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
import Kebayas from "./views/Inventory/Kebaya/Kebayas.jsx";
import Beskaps from "./views/Inventory/Beskap/Beskaps.jsx";
import Gauns from "./views/Inventory/Gaun/Gauns.jsx";
import Products from "./views/Inventory/products.jsx";
import ProductForm from "./views/Inventory/productForm.jsx";
import InvoicePage from "./views/InvoicePage/App.tsx";

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
        path:'products/kebayas',
        element: <Kebayas />
      },
      {
        path:'products/beskaps',
        element: <Beskaps />
      },
      {
        path:'products/gauns',
        element: <Gauns />
      },
      {
        path:'/products',
        element: <Products />
      },
      {
        path:'/products/new',
        element: <ProductForm key="productCreate" />
      },
      {
        path:'/products/:id',
        element: <ProductForm key="productUpdate" />
      },
      {
        path:'/invoices',
        element: <Invoices />
      },
      {
        path:'/invoices/new',
        element: <InvoicesForm key="invoiceCreate" />
      },
      {
        path:'/invoices/:id',
        element: <InvoicesForm key="invoiceUpdate" />
      },
      {
        path:'invoicepage',
        element: <InvoicePage />
      }
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
      // {
      //   path: '/signup',
      //   element: <Signup/>
      // }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
