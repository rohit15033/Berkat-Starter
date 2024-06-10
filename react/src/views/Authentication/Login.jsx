import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider.jsx";
import DSLogo from "../../assets/DSLogo.jpg";
import css from "./authentication.css"

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!emailRef.current.value) {
      errors.email = "Email is required";
    }
    if (!passwordRef.current.value) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const onSubmit = ev => {
    ev.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary" style={{ height: '100vh' }}>
      <div className="container">
        <main className="form-signin w-100 m-auto">
          <form onSubmit={onSubmit}>
            <img className="mb-4" src={DSLogo} alt="" width="72" height="57"/>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}

            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="floatingInput"
                placeholder="name@example.com"
                ref={emailRef}
              />
              <label htmlFor="floatingInput">Email address</label>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="floatingPassword"
                placeholder="Password"
                ref={passwordRef}
              />
              <label htmlFor="floatingPassword">Password</label>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="form-check text-start my-3">
              <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/>
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
              {loading ?
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
            <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
          </form>
        </main>
      </div>
    </div>
  );
}
