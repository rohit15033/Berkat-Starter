import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useEffect } from "react";

export default function Header() {
  const { user, setUser, setToken } = useStateContext();

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      });
  }, [setUser]);

  const onLogout = ev => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  return (
    <>
      <header>
        <div>
          Berkat Admin
        </div>
        <div>
          {user?.name} &nbsp; &nbsp;
          <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
        </div>
      </header>
    </>
  );
}
