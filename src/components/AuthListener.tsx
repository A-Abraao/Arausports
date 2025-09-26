import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuth } from "../firebase";

export default function AuthListener() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuth((user) => {
      if (user) {

        if (location.pathname === "/") {
          navigate("/homepage");
        }
      }
     
    });
    return unsubscribe;
  }, [navigate, location]);

  return null;
}
