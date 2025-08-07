import { Link, useLocation } from "react-router-dom";
import { useShowOption } from "../../hooks/ShowOptionProvider";
import { AxiosInstance } from "../../api/axios";
import { handleError } from "../../api/error";
import { useEffect, useState } from "react";
function Footer() {
  const location = useLocation();
  const pathname = location.pathname;
  const { setShow, setOption } = useShowOption();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/settings");
        setData(res.data.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);

  if (!data) return null;
  const allowedPaths = [
    "/",
    "/categories",
    "/pricing",
    "/learn",
    "/learn/tutorial",
    "/blogpost"
  ];
  if (!allowedPaths.includes(pathname)) {
    return null;
  }
  const isActive = (path) => {
    if (path === "/") {
      return pathname === path ? "active" : "";
    }
    if (pathname.includes(path)) {
      return "active";
    }
    return "";
  };
  return (
    <footer>
      <div className="box footer">
        <div className="footerBox topFooter">
          <div className="footerTitle">
            <h1>
              Ready to design? <br /> Start registration now
            </h1>
            <button
              className="btn"
              onClick={() => {
                setShow(true);
                setOption("options");
              }}
            >
              Start design
            </button>
          </div>
          <div className="media">
            <h2>Follow us on </h2>
            <ul>
              {data.instagram_link && (
                <li>
                  <a href={data.instagram_link} target="_blank">
                    <img src="/media/icons/instagram.svg" alt="" />
                  </a>
                </li>
              )}
              {data.snapchat_link && (
                <li>
                  <a href={data.snapchat_link} target="_blank">
                    <img src="/media/icons/snap.svg" alt="" />
                  </a>
                </li>
              )}
              {data.facebook_link && (
                <li>
                  <a href={data.facebook_link} target="_blank">
                    <img src="/media/icons/facebook.svg" alt="" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footerBox bottomFooter">
          <div className="media">
            <h2>Download Kitaba app </h2>
            {data.app_ios_link && (
              <a href={data.app_ios_link} className="a">
                <img src="/media/apple.png" alt="" />
              </a>
            )}
          </div>
          <div className="media">
            <h2 className="underline">Kitaba </h2>
            <ul className="footerLinks">
              <li>
                <Link to={`/`} className={`${isActive("/")}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={`/categories`}
                  className={`${isActive("categories")}`}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link to={`/pricing`} className={`${isActive("pricing")}`}>
                  Plan & pricing
                </Link>
              </li>
              <li>
                <Link to={`/learn`} className={`${isActive("learn")}`}>
                  Learn
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
