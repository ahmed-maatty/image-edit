import { useState } from "react";

export const useDashboardNav = () => {
  const [active, setActive] = useState(false);
  const handleActive = () => {
    setActive((prev) => !prev);
  };
  const handleSearch = (values) => {
    console.log(values);
  };
  return {
    active,
    setActive,
    handleActive,
    handleSearch,
  };
};
