import React, { useState } from "react";
import CloseBtnPopUp from "../../../../public/media/imgs/Link.png";
import { CustomFooter } from "../../../hooks/CustomFooter";

function Categories() {
  CustomFooter("category_body");

  const [showPopUp, activePopUp] = useState(false);
  const popUpToggle = () => activePopUp((prev) => !prev);

  const foldersData = {
    img: "../../../../public/dofi.jpg",
    folderName: "Folder name here",
  };

  const foldersImgs = [
    "../../../../public/media/category_pop_up/1.jpg",
    "../../../../public/media/category_pop_up/2.jpg",
    "../../../../public/media/category_pop_up/3.jpg",
    "../../../../public/media/category_pop_up/4.jpg",
    "../../../../public/media/category_pop_up/5.jpg",
    "../../../../public/media/category_pop_up/6.jpg",
    "../../../../public/media/category_pop_up/7.jpg",
    "../../../../public/media/category_pop_up/8.jpg",
    "../../../../public/media/category_pop_up/9.jpg",
    "../../../../public/media/category_pop_up/10.jpg",
    "../../../../public/media/category_pop_up/11.jpg",
  ];

  const columns = 3;
  const columnWrapper = Array.from({ length: columns }, () => []);

  foldersImgs.forEach((img, index) => {
    columnWrapper[index % columns].push(img);
  });

  return (
    <>
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse1" />
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse2" />
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse3" />
      <section className="Category">
        <div className="box">
          <header>
            <div className="box-content">
              <h2>Design that feels right.</h2>
              <h1>Tech that works well.</h1>
            </div>
          </header>
          <div className="folders_container">
            <div className="folder_line_one">
              <button
                className="folders folder_one"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_two"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_three"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>
            </div>

            <div className="folder_line_two">
              <button
                className="folders folder_one"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_two"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>
            </div>

            <div className="folder_line_three">
              <button
                className="folders folder_one"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_two"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_two"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>
            </div>

            <div className="folder_line_four">
              <button
                className="folders folder_one"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>

              <button
                className="folders folder_two"
                onClick={() => popUpToggle()}
              >
                <img src={foldersData.img} alt="folder-img" />
                <p>Folder name here</p>
              </button>
            </div>
          </div>
        </div>
        {showPopUp && (
          <div className="popUp_Container">
            <div className="pop_up">
              <div className="folder_name_close_btn">
                <h6>Folder name here</h6>
                <button onClick={() => popUpToggle()}>
                  <img src={CloseBtnPopUp} alt="" />
                </button>
              </div>
              <div className="images_folder">
                {columnWrapper.map((col, colIndex) => (
                  <div className="column" key={colIndex}>
                    {col.map((img, imgIndex) => (
                      <img key={imgIndex} src={img} alt="image" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="layer"></div>
          </div>
        )}
      </section>
    </>
  );
}

export default Categories;
