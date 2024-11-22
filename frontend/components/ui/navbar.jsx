import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import axios from "axios";
import { setUserValue } from "../../state/user-slice";
import { errorToast } from "../../util/toastify";

export const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  // dispatcher
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    axios
      .post("/logout")
      .then(({ data }) => {
        if (data.success) {
          dispatch(setUserValue(null));
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        if (error.response.data.message)
          errorToast(error.response.data.message);
        else errorToast("An error occurred. Please try again.");
      });
  };

  return (
    <div className="mb-5 flex w-full justify-between border-b pb-3">
      {/* brand */}
      <h1 className="text-2xl font-medium text-cyan-700">Book Review</h1>

      {/* login button */}
      {!user && (
        <Link to={"/"}>
          <Button size="sm">Login</Button>
        </Link>
      )}

      {/* logout button */}
      {user && (
        <Button size="sm" variant="destructive" onClick={logout}>
          Logout <LogOut />
        </Button>
      )}
    </div>
  );
};
