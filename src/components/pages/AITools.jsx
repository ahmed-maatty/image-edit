import { Link } from "react-router-dom";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

function AITools() {

  const { active, handleActive, handleSearch } = useDashboardNav();

  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside />
      <div className="container">
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="content">
          <div className="discover">
            <h1>Discover the magic of AI tools</h1>
            <div className="discoverImages">
              <Link to={"/generate"}>
                <img src="/media/d1.png" alt="" />
              </Link>
              <Link to={"/bg-remover"}>
                <img src="/media/d2.png" alt="" />
              </Link>
              <Link to={"/up-scale"}>
                <img src="/media/d3.png" alt="" />
              </Link>
            </div>
          </div>
          <div className="discover">
                <h1>Another way to design</h1>
            <div className="discoverLinks">
              <Link to={"##"}>
                <img src="/media/icons/w1.png" alt="" />
                Whiteboard
              </Link>
              <Link to={"##"}>
                <img src="/media/icons/w2.png" alt="" />
                Backgrounds
              </Link>
              <Link to={"##"}>
                <img src="/media/icons/w3.png" alt="" />
                Upload photo
              </Link>
            </div>
          </div>
          <div className="recent recent2">
            <h3>Recent designs</h3>
            <div className="recent-designs">
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITools;

