import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import axios from "axios";
import { errorToast } from "../util/toastify";
import { transferZodErrors } from "../util/transfer-zod-errors";
import { PiSpinnerBold } from "react-icons/pi";
import { loginSchema } from "../validations";
import { useDispatch } from "react-redux";
import { setUserValue } from "../state/user-slice";

export const LoginForm = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // dispatcher
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear errors
    setError({ email: "", password: "" });
    setLoading(true);

    //validate in frontend with zod
    const validatedData = loginSchema.safeParse(data);

    // if there are errors, set the errors and return
    if (!validatedData.success) {
      setError(transferZodErrors(validatedData.error.errors).error);
      setLoading(false);
      return;
    }

    axios
      .post("/login", data)
      .then(({ data }) => {
        if (data.success) {
          setLoading(false);
          dispatch(setUserValue(data.user));
          navigate("/reviews", { replace: true });
        }
      })
      .catch((err) => {
        if (err.response.data.message) errorToast(err.response.data.message);
        else if (err.response.data.errors)
          setError(transferZodErrors(err.response.data.errors).error);
        else errorToast("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className="mx-3 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={handleChange}
              value={data.email}
            />
            {/* error message */}
            {error.email && (
              <p className="text-xs text-red-500">{error.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="********"
              onChange={handleChange}
              value={data.password}
            />
            {/* error message */}
            {error.password && (
              <p className="text-xs text-red-500">{error.password}</p>
            )}
          </div>
          <Button type="button" onClick={handleSubmit} className="w-full">
            {loading && (
              <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
            )}
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={"/register"} className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
