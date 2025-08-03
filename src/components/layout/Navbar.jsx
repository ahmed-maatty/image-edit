import { useState } from "react";
import { useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import LoginForm from "../fragments/auth/LoginForm";
import SignupForm from "../fragments/auth/SignupForm";
import AuthOptions from "../fragments/auth/AuthOptions";
import ForgotPasswordForm from "../fragments/auth/ForgotPasswordForm";
import NewPasswordForm from "../fragments/auth/NewPasswordForm";
import arSign from "../../../public/media/imgs/ar.png";
import { useShowOption } from "../../hooks/ShowOptionProvider";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const nav = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    setTimeout(() => nav.current?.classList.remove("activeMenu"), 500);
  }, [pathname]);

  const toggleNav = () => {
    nav.current?.classList.toggle("activeMenu");
  };

  // const toggleDrop = (event) => {
  //   event.currentTarget.classList.toggle("active");
  // };
  const isActive = (path) => {
    return pathname === path || (path !== "/" && pathname.includes(path))
      ? "active"
      : "";
  };

  const { show, setShow, option, setOption } = useShowOption();
  const [open, setOpen] = useState(false);
  const handleShow = (option) => {
    setShow(true);
    setOption(option);
  };
  const handleClickPopUp = (event) => {
    if (event.target.className === "popUp") {
      setShow(false);
    }
  };
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);

  const renderAuthForm = () => {
    switch (option) {
      case "login":
        return <LoginForm setOption={setOption} setShow={setShow} />;
      case "signup":
        return <SignupForm setOption={setOption} setShow={setShow} />;
      case "forgot":
        return <ForgotPasswordForm setOption={setOption} setShow={setShow} />;
      case "new":
        return (
          <NewPasswordForm
            setOption={setOption}
            token={token}
            setShow={setShow}
          />
        );
      default:
        return <AuthOptions setOption={setOption} />;
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setShow(true);
      setOption("new");
      setToken(token);
    }
  }, [searchParams]);

  const allowedPaths = [
    "/",
    "/categories",
    "/pricing",
    "/learn",
    "/learn/tutorial",
    "/blogpost",
  ];
  if (!allowedPaths.includes(pathname)) {
    return null;
  }
  return (
    <>
      {show && (
        <div className="popUp" onClick={handleClickPopUp}>
          <div className="popUpInner">
            <div className="authPage">
              <button
                onClick={() => {
                  setShow(false);
                }}
                className="close"
              >
                <img src="/media/icons/material-symbols_close.png" alt="" />
              </button>
              {renderAuthForm()}
              <img className="authImg" src="/media/auth.png" alt="" />
            </div>
          </div>
        </div>
      )}
      <nav ref={nav}>
        <div className="box f-s">
          <Link to="" className="logo">
            <img src="/logo.png" alt="Logo" />
          </Link>
          <div className="links">
            <div className="ls">
              <ul className="mainLinks">
                <li>
                  <Link to={`/`} className={`link ${isActive("/")}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/categories`}
                    className={`link ${isActive("categories")}`}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/pricing`}
                    className={`link ${isActive("pricing")}`}
                  >
                    Plan & pricing
                  </Link>
                </li>
                <li>
                  <div
                    className="Laerndropdown"
                    onMouseEnter={() => setOpen(true)}
                  >
                    <Link to="/learn" className={`link ${isActive("learn")}`}>
                      Learn
                    </Link>

                    {open && (
                      <div
                        className="dropdown-content"
                        onMouseLeave={() => setOpen(false)}
                      >
                        <Link to="/learn">Kitaba Blog</Link>
                        <Link to="/learn/tutorial">Kitaba Tutorial</Link>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="last">
            <div className="mLinks">
              <button className="languageBtn">
                <img src={arSign} alt="" />
              </button>
              <button
                onClick={() => {
                  handleShow("options");
                }}
                className="whiteBtn"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  handleShow("signup");
                }}
                className="yellowBtn"
              >
                Start for free
              </button>
            </div>
            <button className="menu" onClick={toggleNav}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
