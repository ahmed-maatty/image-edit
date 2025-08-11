import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { AxiosInstance } from "../api/axios";
import { handleError } from "../api/error";

export const useAuthHandlers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, resetForm, route, setShow, goTo) => {
    console.log("going to => " , goTo)
    setIsLoading(true);
    try {
      const res = await AxiosInstance.post(route, values);
      toast.success(res.data.message);
      if (route === "login") {
        Cookies.set("token", res.data.token);
      }
      resetForm();

      if (goTo) {
        setTimeout(() => {
          navigate(goTo);
        }, 1500);
      }
      setTimeout(() => {
        setShow(false);
      }, 1500);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
};
