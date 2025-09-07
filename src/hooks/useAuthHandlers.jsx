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
    setIsLoading(true);
    try {
      const {data} = await AxiosInstance.post(route, values);
      toast.success(data.message);
      if (route === "login") {
        Cookies.set("token", data.data.token);
        Cookies.set("username", data.data.user.username);
      }
      resetForm();

      if (goTo) {
        navigate(goTo);
        setTimeout(() => {
        }, 1500);
      }
      setTimeout(() => {
        setShow(false);
      }, 1500);
    } catch (error) {
      console.log(error)
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
