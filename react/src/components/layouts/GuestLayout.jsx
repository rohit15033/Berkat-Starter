import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function GuestLayout() {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
