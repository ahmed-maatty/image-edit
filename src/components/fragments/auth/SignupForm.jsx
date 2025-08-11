import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { Back } from "./BackBtn";
import { useAuthHandlers } from "../../../hooks/useAuthHandlers";
import { Eye, EyeSlash, Arrow, Info } from "./icons/AuthIcons";
import { useState } from "react";

function SignupForm({ setOption, setShow }) {

  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .matches(/[A-Z]/, "At least one capital letter is required")
      .matches(/[a-z]/, "At least one small letter is required")
      .matches(/[0-9]/, "At least one number is required")
      .matches(/[^A-Za-z0-9]/, "At least one special character is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const { isLoading, handleSubmit } = useAuthHandlers();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfo2, setShowInfo2] = useState(false);

  const hasMinLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return (
    <div className="wayBtns wayBtnsLogin">
      <div className="wayBox">
        <div className="logoLink">
          <img className="logo" src="/logo.png" alt="" />
          Sign up
        </div>
        <h1>
          <Back setOption={setOption} />
          Continue with your mail
        </h1>
        <p>Use your email and other details to continue with us</p>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            password_confirmation: "",
          }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm, "register", setShow);
          }}
          validationSchema={validation}
        >
          <Form className="form">
            <div className="input">
              <span>Your mail</span>
              <div className="field">
                <Field
                  name="email"
                  type="email"
                  placeholder="Write your mail"
                />
              </div>
              <p>
                <ErrorMessage name="email" />
              </p>
            </div>

            <div className="input">
              <span>Username</span>
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
                        setPassword(e.target.value);
                      }}
                      onFocus={() => {
                        setShowInfo2(false);
                        setShowInfo(false);
                      }}
                    />
                  )}
                </Field>

                <div
                  className="info"
                  onClick={() => {
                    setShowInfo2(false);
                    setShowInfo((prev) => !prev);
                  }}
                >
                  <Info />
                </div>
                {showInfo && (
                  <>
                    <div className="arrow arrow2">
                      <Arrow />
                    </div>
                    <ul className="infoInner infoInner2">
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

            <div className="input">
              <span>Rewrite password</span>
              <div className="field">
                <Field
                  name="password_confirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  onFocus={() => {
                    setShowInfo(false);
                    setShowInfo2(false);
                  }}
                />
                <div
                  className="info"
                  onClick={() => {
                    setShowInfo(false);
                    setShowInfo2((prev) => !prev);
                  }}
                >
                  <Info />
                </div>
                {showInfo2 && (
                  <>
                    <div className="arrow arrow2">
                      <Arrow />
                    </div>
                    <ul className="infoInner infoInner2">
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
                <ErrorMessage name="password_confirmation" />
              </p>
            </div>

            <button type="submit">
              {isLoading ? <span className="loader"></span> : "Continue"}
            </button>
          </Form>
        </Formik>
        <div className="dont">
          Already have an account?{" "}
          <button onClick={() => setOption("login")}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
