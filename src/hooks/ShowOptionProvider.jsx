import { createContext, useContext, useState } from "react";

// Create context
const ShowOptionContext = createContext();

// Create a provider component
export const ShowOptionProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [option, setOption] = useState("options");
  const [countBG, setCountBG] = useState(null);
  const [indexBG, setIndexBg] = useState(null);
  const [nameBG, setNameBG] = useState(null);

  return (
    <ShowOptionContext.Provider
      value={{
        show,
        setShow,
        option,
        setOption,
        countBG,
        setCountBG,
        indexBG,
        setIndexBg,
        nameBG,
        setNameBG,
      }}
    >
      {children}
    </ShowOptionContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useShowOption = () => useContext(ShowOptionContext);
