import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { useEffect, useRef, useState } from "react";
import { AxiosBG } from "../../api/axios";
import { handleError } from "../../api/error";
import { useNavigate } from "react-router-dom";
import Loader from "../fragments/Loader";
import GoTop from "../fragments/GoTop";

function Backgrounds() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState({
    name: null,
    count: 0,
    index: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosBG.get("/assets/backgrounds.json");
        setData(res.data.backgrounds_new);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const resetCategory = () => {
    if (category.name !== null) {
      setCategory({ name: null, count: 0, index: null });
    } else {
      navigate("/dashboard");
    }
  };
  const handleCategorySelect = (item, index) => {
    setLoading(true);
    setTimeout(() => {
      setCategory({
        name: item.backgroundsCatName.en,
        count: +item.bgImagesCount || 0,
        index,
      });
      setLoading(false);
    }, 500);
  };
  const btnRef = useRef(null);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current.scrollTop > 100) {
      btnRef.current.classList.add("show");
    } else {
      btnRef.current.classList.remove("show");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside />
      <button ref={btnRef} tabIndex={0} onClick={scrollToTop} className="goTop">
        <span>
          <i className="fa-regular fa-angle-up"></i>
        </span>
      </button>

      <div className="container" ref={containerRef}>
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="content">
          <div className="bgs">
            {!loading && <BackButton resetCategory={resetCategory} />}

            {loading ? (
              <Loader />
            ) : category.name === null ? (
              <div className="bgc">
                <div className="pti">
                  <h3>
                    {" "}
                    {!loading && (
                      <BackButton resetCategory={resetCategory} />
                    )}{" "}
                    Backgrounds
                  </h3>
                  <span>
                    Home &gt; <span>Background</span>
                  </span>
                </div>
                <div className="bgbox">
                  {data &&
                    data.map((item, index) => (
                      <button
                        className="bg"
                        key={index}
                        onClick={() => {
                          handleCategorySelect(item, index);
                        }}
                      >
                        <img
                          src={`https://3rabapp.com/apps/assets/categories/cat${index}.png`}
                          alt={item.catName || ""}
                        />
                        <h4>{item.backgroundsCatName.en}</h4>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bgc">
                <div className="pti">
                  <h3>
                    {" "}
                    {!loading && (
                      <BackButton resetCategory={resetCategory} />
                    )}{" "}
                    {category.name}
                  </h3>
                  <span>
                    Home &gt; <span>Background</span> &gt;{" "}
                    <span>{category.name}</span>
                  </span>
                </div>
                <div className="bgbox">
                  {[...Array(category.count)].map((_, index) => (
                    <button
                      className="bg"
                      key={index}
                      onClick={() => {
                        const imgUrl = `http://3rabapp.com/apps/assets/bg-thnumbail/cat${category.index}-${index}.png`;
                        sessionStorage.setItem("imgUrl", imgUrl);
                        navigate("/editor");
                      }}
                    >
                      <img
                        src={`http://3rabapp.com/apps/assets/bg-thnumbail/cat${category.index}-${index}.png`}
                        alt={`Thumbnail ${index}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Backgrounds;

function BackButton({ resetCategory }) {
  return (
    <button onClick={resetCategory} className="back">
      <img src="/media/icons/bigarrow.svg" alt="Back" />
    </button>
  );
}
