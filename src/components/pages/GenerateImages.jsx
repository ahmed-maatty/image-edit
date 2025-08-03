import { Link } from "react-router-dom";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { useState } from "react";
import AlsoLinks from "../fragments/ai/AlsoLinks";
const aspectRatios = [
  "1:1",
  "3:4",
  "4:3",
  "16:9",
  "9:16",
  "9:20",
  "3:2",
  "2:3",
  "2:1",
  "1:2",
  "5:4",
  "4:5",
];

const styles = [
  { name: "Photo", image: "/media/styles/photo.png" },
  { name: "Digital art", image: "/media/styles/digital-art.png" },
  { name: "3D", image: "/media/styles/3d.png" },
  { name: "Vintage", image: "/media/styles/vintage.png" },
  { name: "Painting", image: "/media/styles/painting.png" },
  { name: "Low-poly", image: "/media/styles/low-poly.png" },
  { name: "Pixel art", image: "/media/styles/pixel-art.png" },
  { name: "Cartoon", image: "/media/styles/cartoon.png" },
  { name: "Anime", image: "/media/styles/anime.png" },
  { name: "Cyberpunk", image: "/media/styles/cyberpunk.png" },
  { name: "Comic", image: "/media/styles/comic.png" },
  { name: "Vector", image: "/media/styles/vector.png" },
  { name: "Studio shot", image: "/media/styles/studio-shot.png" },
  { name: "Dark", image: "/media/styles/dark.png" },
  { name: "Sketch", image: "/media/styles/sketch.png" },
  { name: "Mockup", image: "/media/styles/mockup.png" },
  { name: "70s vibe", image: "/media/styles/70s.png" },
  { name: "Watercolor", image: "/media/styles/watercolor.png" },
  { name: "Art nouveau", image: "/media/styles/art-nouveau.png" },
  { name: "Origami", image: "/media/styles/origami.png" },
  { name: "Surreal", image: "/media/styles/surreal.png" },
  { name: "Traditional", image: "/media/styles/traditional.png" },
  { name: "2000s pone", image: "/media/styles/2000s.png" },
  { name: "Fantasy", image: "/media/styles/fantasy.png" },
];

function GenerateImages() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("3:4");

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setIsOpen2(false);
  };

  const handleSelect = (ratio) => {
    setSelectedRatio(ratio);
    setIsOpen(false);
  };
  const shapeBase = 15;
  const [w, h] = selectedRatio.split(":").map(Number);
  const max = Math.max(w, h);
  const previewSize = shapeBase;
  const width = (w / max) * previewSize;
  const height = (h / max) * previewSize;

  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(styles[0]); // Watercolor by default

  const toggleDropdown2 = () => {
    setIsOpen2((prev) => !prev);
    setIsOpen(false);
  };

  const selectStyle = (style) => {
    setSelectedStyle(style);
    setIsOpen2(false);
  };
  const handleDownload = (event) => {
    const url = event.target.src;
    const filename = url.split("/").pop(); 
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside type={2} />
      <div className="container dashb">
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="content">
          <div className="igContent">
            <AlsoLinks/>
            <div className="otherContent">
              <div className="generateInput">
                <h1>What will you design today?</h1>
                <div className="input">
                  <div className="field">
                    <textarea
                      name="text"
                      type="text"
                      placeholder="Write what you imagine here"
                    />
                  </div>
                </div>
                <div className="styleAndGen">
                  <div className="styleBtns">
                    <div className="size-selector">
                      <button
                        className={
                          isOpen ? "selector-toggle active" : "selector-toggle"
                        }
                        onClick={toggleDropdown}
                      >
                        <span className="label">
                          Size <i className="fa-regular fa-angle-down"></i>
                        </span>
                        <span className="value">
                          <span
                            className="shape"
                            style={{
                              width: `${width}px`,
                              height: `${height}px`,
                            }}
                          />
                          {selectedRatio}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="selector-dropdown">
                          {aspectRatios.map((ratio) => {
                            const [w, h] = ratio.split(":").map(Number);
                            const scale = shapeBase / Math.max(w, h);
                            const shapeWidth = w * scale;
                            const shapeHeight = h * scale;

                            return (
                              <button
                                key={ratio}
                                className={`ratio-btn ${
                                  selectedRatio === ratio ? "active" : ""
                                }`}
                                onClick={() => handleSelect(ratio)}
                              >
                                <span
                                  className="shape"
                                  style={{
                                    width: `${shapeWidth}px`,
                                    height: `${shapeHeight}px`,
                                  }}
                                />
                                {ratio}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="style-selector">
                      <button
                        className={
                          isOpen2 ? "style-toggle active" : "style-toggle"
                        }
                        onClick={toggleDropdown2}
                      >
                        <span className="label">
                          Style <i className="fa-regular fa-angle-down"></i>
                        </span>
                        <span className="value">{selectedStyle.name}</span>
                      </button>

                      {isOpen2 && (
                        <div className="style-dropdown">
                          {styles.map((style) => (
                            <button
                              key={style.name}
                              className={`style-card ${
                                selectedStyle.name === style.name
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => selectStyle(style)}
                            >
                              <img src={style.image} alt={style.name} />
                              <span>{style.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="btn btn2 btn3">
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 1L18.24 3.75L15.5 5L18.24 6.26L19.5 9L20.75 6.26L23.5 5L20.75 3.75M9.5 4L7 9.5L1.5 12L7 14.5L9.5 20L12 14.5L17.5 12L12 9.5M19.5 15L18.24 17.74L15.5 19L18.24 20.25L19.5 23L20.75 20.25L23.5 19L20.75 17.74"
                        fill="#3E3C37"
                      />
                    </svg>
                    Generate image
                  </button>
                </div>
                <p className="noteForIG">
                  Your image will be generated in a {selectedRatio} ratio, but
                  you can choose a different ratio in the next section.
                </p>
              </div>

              <div className="recent recent2">
                <h3 className="seeAll">
                  Your latest generating
                  <Link to={"##"} className="a">
                    Sell All
                  </Link>
                </h3>
                <div className="recent-generates">
                  <p>A tortoise eats a lettuce </p>
                  <div className="gsimgs">
                    <img
                      src="/media/recent.png"
                      alt=""
                      onClick={handleDownload}
                    />
                    <img
                      src="/media/recent.png"
                      alt=""
                      onClick={handleDownload}
                    />
                    <img
                      src="/media/recent.png"
                      alt=""
                      onClick={handleDownload}
                    />
                    <img
                      src="/media/recent.png"
                      alt=""
                      onClick={handleDownload}
                    />
                  </div>
                </div>
              </div>
              <div className="recent recent2">
                <h3 className="seeAll">
                  Recent designs{" "}
                  <Link to={"##"} className="a">
                    Sell All
                  </Link>
                </h3>
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
      </div>
    </div>
  );
}

export default GenerateImages;
