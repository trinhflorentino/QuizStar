import React from "react";

const LegacyRedirect: React.FC = () => {
  // useEffect(() => {
  //   // Perform the redirection
  //   window.location.href = "/Main.html";
  //   // Alternatively, for client-side navigation within React Router:
  //   // navigate("/Main.html", { replace: true });
  // }, [navigate]);
  window.location.href = "/Main.html";

  return null; // or a loading indicator if desired
};

export default LegacyRedirect;




