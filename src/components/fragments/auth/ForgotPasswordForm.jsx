import { ErrorMessage, Field, Formik, Form } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Back } from "./BackBtn";
import { useAuthHandlers } from "../../../hooks/useAuthHandlers";

function ForgotPasswordForm({setOption,setShow}) {
  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });
    const { isLoading, handleSubmit } = useAuthHandlers();
  return (
    <div className="wayBtns wayBtnsLogin">
      <div className="wayBox">
        <div className="logoLink">
          <img className="logo" src="/logo.png" alt="" />
          Forgot password
        </div>
        <h1>
          <Back setOption={setOption} option={'login'}/>
          Continue with your mail
        </h1>
        <p>
          Please enter your email address, we will send you a link to create a
          new password{" "}
        </p>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm, "forget-password", setShow );
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
            <button type="submit">
              {isLoading ? <span className="loader"></span> : "Send"}
            </button>
          </Form>
        </Formik>
        <div className="note">
          Note: If you sign-up using social media account, please make sure you
          try to login using the same account
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
