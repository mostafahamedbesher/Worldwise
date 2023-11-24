import { useEffect } from "react";
import { useAuth } from "../Contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthinecated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthinecated) navigate("/");
    },
    [isAuthinecated, navigate]
  );

  return children;
}

export default ProtectedRoute;
