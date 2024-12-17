import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LegacyRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the redirection
    window.location.href = "/Main.html";
    // Alternatively, for client-side navigation within React Router:
    // navigate("/Main.html", { replace: true });
  }, [navigate]);

  return null; // or a loading indicator if desired
}

export default LegacyRedirect;