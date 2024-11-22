import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./app/login/page";
import Register from "./app/register/page";
import Reviews from "./app/reviews/page";
import { useDispatch } from "react-redux";
import { setUserValue } from "../state/user-slice";
import { useCallback, useEffect } from "react";
import SelectedReviews from "./app/selected-reviews/page";

function App() {
  // setup axios default base url
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  // load user data
  const getUser = useCallback(async () => {
    axios.get("/me").then(({ data }) => {
      dispatch(setUserValue(data?.user));
    });
  }, [dispatch]);

  // load user data on app load
  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <main>
      {/* react toastify toast container */}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<SelectedReviews />} />
          <Route
            path="*"
            element={
              <div className="flex h-screen w-full items-center justify-center">
                <h1 className="text-4xl">404 - Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
