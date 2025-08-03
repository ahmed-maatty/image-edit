import { useContext } from "react";
import { ShowOptionContext } from "./ShowOptionProvider";

export const useShowOption = () => useContext(ShowOptionContext);
