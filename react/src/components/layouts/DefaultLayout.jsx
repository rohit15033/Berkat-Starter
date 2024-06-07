import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../Header/Header.jsx";

export default function DefaultLayout() {
  const { token, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div id="defaultLayout" className="d-flex">
      <Sidebar />
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  );
}
