import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Perform the redirection
  //   window.location.href = "/Login.html";
  //   // Alternatively, for client-side navigation within React Router:
  //   // navigate("/Main.html", { replace: true });
  // }, [navigate]);
  window.location.href = "/Login.html";

  return null; // or a loading indicator if desired
}

export default Login;