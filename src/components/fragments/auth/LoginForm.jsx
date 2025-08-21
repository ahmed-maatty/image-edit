import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { Back } from "./BackBtn";
import { useState } from "react";
import { useAuthHandlers } from "../../../hooks/useAuthHandlers";
import { Arrow, Eye, EyeSlash, Info } from "./icons/AuthIcons";

function LoginForm({ setOption, setShow }) {
  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .matches(/[A-Z]/, "At least one capital letter is required")
      .matches(/[a-z]/, "At least one small letter is required")
      .matches(/[0-9]/, "At least one number is required")
      .matches(/[^A-Za-z0-9]/, "At least one special character is required"),
  });
  const { isLoading, handleSubmit } = useAuthHandlers();
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const hasMinLength = passwordValue.length >= 8 && passwordValue.length <= 16;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="wayBtns wayBtnsLogin">
      <div className="wayBox">
        <div className="logoLink">
          <img className="logo" src="/logo.png" alt="" />
          Log in
        </div>
        <h1>
          <Back setOption={setOption} />
          Continue with your email
        </h1>
        <p>Use your email and password to continue with us </p>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm, "login", setShow, "/dashboard");
          }}
          validationSchema={validation}
        >
          <Form className="form">
            <div className="input">
              <span>Your username</span>
              <div className="field">
                <Field
                  name="username"
                  type="text"
                  placeholder="Write your username"
                />
              </div>
              <p>
                <ErrorMessage name="username" />
              </p>
            </div>
            <div className="input">
              <span>Password</span>
              <div className="field">
                <Field name="password">
                  {({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      onChange={(e) => {
                        field.onChange(e);
                        setPasswordValue(e.target.value);
                      }}
                      onFocus={() => {
                        setShowInfo(false);
                      }}
                    />
                  )}
                </Field>

                <div
                  className="info"
                  onClick={() => {
                    setShowInfo((prev) => !prev);
                  }}
                >
                  <Info />
                  {showInfo && (
                    <>
                      <div className="arrow">
                        <Arrow />
                      </div>
                      <ul className="infoInner">
                        <li>Your password must contain:</li>
                        <li className={hasMinLength ? "active" : ""}>
                          <i className="fa-solid fa-check-circle"></i> 8 to 16
                          characters
                        </li>
                        <li className={hasUppercase ? "active" : ""}>
                          <i className="fa-solid fa-check-circle"></i> At least
                          one capital letter
                        </li>
                        <li className={hasLowercase ? "active" : ""}>
                          <i className="fa-solid fa-check-circle"></i> At least
                          one small letter
                        </li>
                        <li className={hasNumber ? "active" : ""}>
                          <i className="fa-solid fa-check-circle"></i> At least
                          one number
                        </li>
                        <li className={hasSpecial ? "active" : ""}>
                          <i className="fa-solid fa-check-circle"></i> At least
                          one special character
                        </li>
                      </ul>
                    </>
                  )}
                </div>
                <div
                  className="eye"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </div>
              </div>
              <p>
                <ErrorMessage name="password" />
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOption("forgot");
              }}
              className="forgot"
            >
              Forgot password ?
            </button>
            <button type="submit">
              {isLoading ? <span className="loader"></span> : "Continue"}
            </button>
          </Form>
        </Formik>
        <div className="dont">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              setOption("signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
