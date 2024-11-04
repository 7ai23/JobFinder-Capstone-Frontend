import React, { useEffect, useState } from "react";
import {
  IoMdCall,
  IoMdLock,
  IoMdEye,
  IoMdEyeOff,
  IoMdPerson,
  IoMdMail,
} from "react-icons/io";
import { FaGenderless, FaRegAddressBook } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { login, signUp, setUser } from "../../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import firebase from "../../../utils/firebase";
import Validation from "@/components/User/Common/Validation";

const roles = ["User", "Company"];

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    retypePassword: "",
    roleCode: "",
  });
  const navigate = useNavigate();
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowRetypePassword = () =>
    setShowRetypePassword(!showRetypePassword);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth); // Lấy trạng thái auth từ Redux store

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    const errors = Validation({ ...formData, [name]: value });
    setErrorMessage((prev) => ({ ...prev, [name]: errors[name] || "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = Validation(formData);
    setErrorMessage(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const result = await dispatch(signUp(formData)).unwrap();
        // Điều hướng sau khi thành công, nếu cần
        if (formData.roleCode === "User") {
          console.log("Sign Up Successful", result);
          localStorage.setItem("email", formData.email);
          localStorage.setItem("user_id", result.user?.id);
          fetchUser(result.user?.id);
          navigate("/profileUpdate/experience");
        } else if (formData.roleCode === "Company") {
          console.log("Sign Up Successful", result);
          localStorage.setItem("email", formData.email);
          localStorage.setItem("user_id", result.user?.id);
          fetchUser(result.user?.id);
          navigate("/signupCompany");
        } else {
          console.log("LOI ROI");
        }
      } catch (error) {
        console.log("image", formData.image);
        console.error("Sign Up Error:", error);
      }
    } else {
      console.log("con loi");
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`/getUserById?id=${userId}`);

      console.log("Response from /getUserById:", response.data);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data)); // Lưu thông tin người dùng vào localStorage
        console.log("User data set in Redux and localStorage:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  //validation
  const [errorMessage, setErrorMessage] = useState("");

  // const formatPhoneNumber = (phoneNumber) => {
  //   // Thêm mã quốc gia +84 và bỏ số 0 đầu tiên nếu cần
  //   if (phoneNumber.startsWith("0")) {
  //     return "+84" + phoneNumber.slice(1);
  //   }
  //   return phoneNumber;
  // };
  // const handleSubmit = async (e) => {
  //   //  firebase.auth().settings.appVerificationDisabledForTesting = true;
  //   e.preventDefault();

  //   try {
  //     if (!window.recaptchaVerifier) {
  //       // Kiểm tra và khởi tạo reCAPTCHA nếu chưa có hoặc nếu đã hết hạn

  //       window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //         "recaptcha-container",
  //         {
  //           'size': "invisible",
  //           defaultCountry: "VN",
  //           callback: (response) => {
  //             console.log("reCAPTCHA solved, can proceed with OTP sending.",response);

  //           },
  //           "expired-callback": (response) => {
  //             console.error("reCAPTCHA expired. Please solve the CAPTCHA again.", response);
  //           },
  //         }
  //       );
  //       // console.log(
  //       //   "reCAPTCHA verifier already exists:",
  //       //   window.recaptchaVerifier
  //       // );
  //       console.log(
  //         "reCAPTCHA verifier initialized:",
  //         window.recaptchaVerifier
  //       );
  //     }
  //     await sendOtp(); // Nếu reCAPTCHA hợp lệ, tiến hành gửi OTP
  //     // navigate("/otp");
  //   } catch (error) {
  //     console.error("Error during OTP sending:", error.message);
  //   }
  // };
  // const sendOtp = async () => {
  //   const appVerify = window.recaptchaVerifier;
  //   const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber); // Format số điện thoại
  //   console.log("sdt ne", formattedPhoneNumber);
  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(formattedPhoneNumber, appVerify)
  //     .then((confirmationResult) => {
  //       console.log("sdt", formattedPhoneNumber);
  //       // Store confirmation result globally
  //       window.confirmationResult = confirmationResult; // Save OTP verification result globally
  //       console.log("gui otp thanh cong");
  //       localStorage.setItem("phoneNumber", formattedPhoneNumber);
  //       navigate("/otp", { state: formData });
  //     })
  //     .catch((error) => {
  //       if (error.code === "auth/invalid-app-credential") {
  //         console.error(
  //           "reCAPTCHA token expired or invalid. Please reload reCAPTCHA."
  //         );
  //         if (window.recaptchaVerifier) {
  //           window.recaptchaVerifier.clear(); // Clear the old reCAPTCHA verifier
  //           window.recaptchaVerifier = null;  // Reset to null
  //         }
  //       }
  //       console.error("Failed to send OTP:", error);
  //     });
  // };
  // useEffect(() => {
  //   if (!window.recaptchaVerifier) {
  //     const verifier = new firebase.auth.RecaptchaVerifier(
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //         callback: (response) => {
  //           console.log("reCAPTCHA solved, can proceed with OTP sending.");
  //         },
  //         "expired-callback": () => {
  //           console.error("reCAPTCHA expired. Please solve the CAPTCHA again.");
  //         },
  //       }
  //     );
  //     setRecaptchaVerifier(verifier);
  //   }
  // }, []);
  return (
    <div className="flex-1 px-12 py-14 mx-auto bg-secondary flex flex-col items-center justify-center border border-gray-300">
      {/* Recaptcha container */}
      <div id="recaptcha-container"></div>
      <form className="w-[524px]" onSubmit={handleSubmit}>
        <h1 className="mb-8 text-5xl text-primary font-title">Sign Up</h1>

        <div className="mb-6">
          <div className="relative flex items-center mb-4">
            <IoMdMail className="text-gray-500 mr-2 absolute left-3" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`flex items-center border ${
                errorMessage.email ? "border-red-500" : "focus:border-primary"
              } py-7 px-10`}
            />
          </div>
          {errorMessage.email && (
            <p className="text-red-500 -mt-3 mb-2">{errorMessage.email}</p>
          )}

          <div className="relative flex items-center mb-4">
            <IoMdLock className="text-gray-500 mr-2 absolute left-3" />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`flex items-center border ${
                errorMessage.password
                  ? "border-red-500"
                  : "focus:border-primary"
              } py-7 px-10`}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-5"
            >
              {showPassword ? (
                <IoMdEyeOff className="text-gray-500" />
              ) : (
                <IoMdEye className="text-gray-500" />
              )}
            </button>
          </div>
          {errorMessage.password && (
            <p className="text-red-500 -mt-3 mb-2">{errorMessage.password}</p>
          )}

          <div className="relative flex items-center mb-4">
            <IoMdLock className="text-gray-500 mr-2 absolute left-3" />
            <Input
              name="retypePassword"
              type={showRetypePassword ? "text" : "password"}
              placeholder="Retype Password"
              value={formData.retypePassword}
              onChange={(e) => handleChange(e)}
              className={`flex items-center border ${
                errorMessage.retypePassword
                  ? "border-red-500"
                  : "focus:border-primary"
              } py-7 px-10`}
            />
            <button
              type="button"
              onClick={toggleShowRetypePassword}
              className="absolute right-5"
            >
              {showRetypePassword ? (
                <IoMdEyeOff className="text-gray-500" />
              ) : (
                <IoMdEye className="text-gray-500" />
              )}
            </button>
          </div>
          {errorMessage.retypePassword && (
            <p className="text-red-500 -mt-3 mb-2">
              {errorMessage.retypePassword}
            </p>
          )}

          <div className="relative flex items-center mb-4">
            <FaGenderless className="text-gray-500 mr-2 absolute left-3" />
            <Select
              className="rounded-full"
              name="roleCode"
              value={formData.roleCode}
              onValueChange={(value) =>
                setFormData({ ...formData, roleCode: value })
              }
            >
              <SelectTrigger className="w-full rounded-full py-7 pl-10 pr-4">
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="my-7 flex items-center justify-center">
            <Button
              type="submit"
              className="text-white rounded-full w-full py-5 px-7 transition transform hover:scale-105"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
