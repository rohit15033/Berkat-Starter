import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../profile/Profile.jsx";

export default function DefaultLayout() {
  const { token, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
    <div id="defaultLayout" className="d-flex overflow-hidden">
      <Sidebar />
      <div id = "outlet-notification" className="d-flex flex-column flex-grow-1 overflow-auto p-2">
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
    </>
  );
}
