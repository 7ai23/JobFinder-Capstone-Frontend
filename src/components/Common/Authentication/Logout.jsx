
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/features/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("company_id");
    localStorage.removeItem("admin_id");
    dispatch(logout());
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 cursor-pointer w-full"
    >
      Logout
    </button>
  );
};

export default Logout;
