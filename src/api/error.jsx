import axios from "axios";
import toast from "react-hot-toast";

export const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.error || "Error occurred");
  } else {
    toast.error("Unexpected error occurred");
  }
};