import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import useFetch from "../hooks/useFetch";
import { login } from "../db/apiAuth";
import { UrlState } from "@/context";
import { Eye, EyeOff } from "lucide-react"; // 👁 icons

// ✅ Schema outside component
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("longLink");

  const { data, error, loading, fn: fnLogIn } = useFetch(login);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      toast.success("Login successful 🎉");
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
    if (error) {
      toast.error(error.message || "Login failed. Try again.");
    }
  }, [data, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const cleanedFormData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      };

      await loginSchema.validate(cleanedFormData, { abortEarly: false });
      await fnLogIn(cleanedFormData);
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((e) => (newErrors[e.path] = e.message));
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
            />
            {errors.email && <Error message={errors.email} />}
          </div>

          <div className="space-y-1 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            {/* 👁 Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <Error message={errors.password} />}
          </div>

          {error && (
            <Error message={error.message || "Login failed. Try again."} />
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <BeatLoader size={10} color="#fff" /> : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Login;
