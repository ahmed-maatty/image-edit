import { useEffect, useRef } from "react";

function GoTop() {
  const btnRef = useRef(null);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      btnRef.current.classList.add("show");
    } else {
      btnRef.current.classList.remove("show");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <button
      ref={btnRef}
      tabIndex={0}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="goTop "
    >
      <span>
        <i className="fa-regular fa-angle-up"></i>
      </span>
    </button>
  );
}

export default GoTop;
