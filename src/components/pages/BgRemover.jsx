import React from "react";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import AlsoLinks from "../fragments/ai/AlsoLinks";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

function BgRemover() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const inputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showShareImage, setShowShareImage] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setResultImages([]);
    }
  };

  const handleDownload = (url) => {
    const filename = url.split("/").pop();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copylinkHandler = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Copied To The Clipord"))
      .catch(() => toast.error("error accured!"));
  };

  const [showOption, setShowOption] = useState("social");

  const setBtnActive = (btn) => {
    const btns = document.querySelectorAll(".bg-remover-options");
    btns.forEach((e) => {
      e.classList.remove("active");
    });
    btn.classList.add("active");
    setShowOption(() => btn.id);
  };

  const recentprojecarr = [
    { imgPath: "/media/d222.png" },
    { imgPath: "/media/d222.png" },
    { imgPath: "/media/d222.png" },
    { imgPath: "/media/d222.png" },
    { imgPath: "/media/d222.png" },
  ];

  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside type={2} />
      <div className="container dashb">
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="content">
          <div className="igContent">
            <AlsoLinks />
            <div className="otherContent">
              {!uploadedImage && (
                <div>
                  <div className="flexcenter50">
                    <div className="generateInput imgInput">
                      <h1>
                        Erase the background <br /> from an image
                      </h1>
                      <div className="input">
                        <label
                          htmlFor="img"
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              const dataTransfer = new DataTransfer();
                              dataTransfer.items.add(file);
                              inputRef.current.files = dataTransfer.files;
                              handleFileChange({ target: inputRef.current });
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnter={(e) => e.preventDefault()}
                        >
                          <h4>Drag and drop image here</h4>
                          <span>JPG, PNG / Max. 8 MB / Min. 224px x 224px</span>
                        </label>
                        <input
                          type="file"
                          name="img"
                          id="img"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          ref={inputRef}
                        />
                      </div>

                      <p className="noteForIG">
                        Automatically erase backgrounds and highlight the
                        subject of your images in a few simple steps. Quick,
                        easy and professional results!
                      </p>
                    </div>
                    <img
                      className="bg-remover-img"
                      src="/media/d222.png"
                      alt=""
                      width={"460px"}
                    />
                  </div>
                </div>
              )}

              {uploadedImage && (
                <div className="up-scale-remove-container">
                  <div className="generateInput imgInput upinput">
                    <div className="input">
                      <label
                        htmlFor="img"
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith("image/")) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            inputRef.current.files = dataTransfer.files;
                            handleFileChange({ target: inputRef.current });
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        <h4>Drag and drop image here</h4>
                        <span>JPG, PNG / Max. 8 MB / Min. 224px x 224px</span>
                      </label>
                      <input
                        type="file"
                        name="img"
                        id="img"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        ref={inputRef}
                      />
                    </div>
                    <p className="noteForIG">
                      Automatically erase backgrounds and highlight the subject
                      of your images in a few simple steps. Quick, easy and
                      professional results!
                    </p>
                  </div>

                  <div className="rimages">
                    <div className="uplodedImage linearBorder">
                      <img src={uploadedImage} alt="Uploaded" />
                    </div>

                    {resultImages.length > 0 && (
                      <div className="rs">
                        {resultImages.map((img, index) => (
                          <div
                            key={index}
                            className="uplodedImage uplodedImage2 linearBorder"
                            onClick={() => {
                              setUploadedImage(img);
                            }}
                          >
                            <img src={img} alt={`Result ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="save-share-btns">
                    <div className="save-btn-container">
                      <button
                        className="save-btn"
                        onClick={() => {
                          handleDownload(uploadedImage);
                          setShowSaveMenu(true);
                        }}
                      >
                        <img src="/media/saveIcon.png" alt="" />
                        Save to a project
                      </button>
                      {showSaveMenu && (
                        <div className="save-drop-down">
                          <div className="recent-project-close">
                            <p>Recent projects</p>
                            <button onClick={() => setShowSaveMenu(false)}>
                              <img src="/media/closeSign.png" alt="" />
                            </button>
                          </div>
                          <div className="recent-projects-dropdown-save">
                            <button className="create-project-btn">
                              Create new project
                            </button>
                            {recentprojecarr.map((img, index) => (
                              <button key={index}>
                                <img src={img.imgPath} alt="" />
                              </button>
                            ))}
                          </div>
                          <div className="loadMore-btn">
                            <button>Load more</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        className="share-btn"
                        onClick={() => setShowShareImage(true)}
                      >
                        <img src="/media/uil_export.png" alt="" />
                        Share image
                      </button>
                      {showShareImage && (
                        <div className="save-drop-down share-image-download">
                          <div className="recent-project-close">
                            <p>Share image</p>
                            <button onClick={() => setShowShareImage(false)}>
                              <img src="/media/closeSign.png" alt="" />
                            </button>
                          </div>
                          <div className="share-download-btn">
                            <button
                              onClick={() => handleDownload(uploadedImage)}
                            >
                              <img src="/media/download-Image.png" alt="" />
                              <p>Download image</p>
                            </button>
                            <button
                              onClick={() => copylinkHandler(uploadedImage)}
                            >
                              <img src="/media/linkImage.png" alt="" />
                              <p>Copy link</p>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-remover-usage">
                <div className="content-container-bg-remover">
                  <img src="/media/removerIcon.png" alt="" />
                  <h1 className="content-details">
                    What can I do with Kitaba BG remover?
                  </h1>
                </div>
                <p>
                  The Remove Background AI feature automatically removes the
                  background from images, leaving only the subject. It provides
                  clean, accurate cut-outs with a transparent background, making
                  it easy to create professional visuals quickly and without
                  manual editing.
                </p>
                <div>
                  <div className="bg-remover-options-container">
                    <button
                      className="bg-remover-options active"
                      id="social"
                      onClick={(e) => setBtnActive(e.currentTarget)}
                    >
                      <img src="/media/edite-create.png" alt="" />
                      <p>Social Media Content</p>
                    </button>
                    <button
                      className="bg-remover-options"
                      id="promotion"
                      onClick={(e) => setBtnActive(e.currentTarget)}
                    >
                      <img src="/media/percentage.png" alt="" />
                      <p>Product Promotions</p>
                    </button>
                    <button
                      className="bg-remover-options"
                      id="moodboard"
                      onClick={(e) => setBtnActive(e.currentTarget)}
                    >
                      <img src="/media/moodboard.png" alt="" />
                      <p>Mood Boards</p>
                    </button>
                  </div>

                  <div className="content-bg-remover-option-container">
                    {showOption === "social" && (
                      <div className="content-bg-remover-option">
                        <div className="content-text">
                          <div className="header-text">
                            <img src="/media/edite-create.png" alt="" />
                            <h4>Social Media Content</h4>
                          </div>
                          <p>
                            Once you've removed the background, you can place
                            yourself or your product into any setting — from
                            minimalist white to dreamy aesthetics.
                            <br />
                            📱Use case: Add yourself to a trendy background for
                            Instagram stories, or create TikTok thumbnails with
                            glowing effects behind your makeup look.
                          </p>
                        </div>
                        <div className="content-img">
                          <img src="/media/Group-social.png" alt="" />
                        </div>
                      </div>
                    )}

                    {showOption === "promotion" && (
                      <div className="content-bg-remover-option">
                        <div className="content-text">
                          <div className="header-text">
                            <img src="/media/percentage.png" alt="" />
                            <h4>Product Promotions</h4>
                          </div>
                          <p>
                            Easily remove backgrounds from product images to
                            create clean, eye-catching visuals perfect for
                            marketing and advertising.
                            <br />
                            📱Use case: Add yourself to a trendy background for
                            Instagram stories, or create TikTok thumbnails with
                            glowing effects behind your makeup look.
                          </p>
                        </div>
                        <div className="content-img">
                          <img src="/media/lotion.png" alt="" />
                        </div>
                      </div>
                    )}

                    {showOption === "moodboard" && (
                      <div className="content-bg-remover-option">
                        <div className="content-text">
                          <div className="header-text">
                            <img src="/media/moodboard.png" alt="" />
                            <h4>Mood Boards</h4>
                          </div>
                          <p>
                            Quickly isolate objects or products by removing
                            backgrounds to create cohesive, visually inspiring
                            mood boards with a consistent aesthetic.
                            <br />
                            📱Use case: A fashion designer builds a seasonal
                            mood board by removing backgrounds from clothing
                            images, making it easier to mix and match pieces and
                            align the board with their design vision.
                          </p>
                        </div>
                        <div className="content-img">
                          <img src="/media/lotion.png" alt="" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BgRemover;
