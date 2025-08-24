import React, { useState, useEffect } from "react";
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
import { signup } from "../db/apiAuth";
import { UrlState } from "@/context";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

function SignUp() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("longLink");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const { data, error, loading, fn: fnSignUp } = useFetch(signup, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleSignUp = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile pic is required"),
      });

      const cleanedFormData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      };

      await schema.validate(cleanedFormData, { abortEarly: false });
      await fnSignUp(cleanedFormData);
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SignUp</CardTitle>
        <CardDescription>
          Create a new account if you don't have any
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter your name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>

        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        <div className="space-y-1 relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {/* 👁️ Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <Error message={errors.password} />}
        </div>

        <div className="space-y-1">
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignUp} disabled={loading} className="w-full">
          {loading ? <BeatLoader size={10} color="#fff" /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
