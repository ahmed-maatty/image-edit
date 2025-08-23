import React, { useState, useEffect } from "react";
import CloseBtnPopUp from "../../../../public/media/imgs/Link.png";
import { CustomFooter } from "../../../hooks/CustomFooter";
import { handleError } from "../../../api/error";
import { AxiosBG } from "../../../api/axios";

function Categories() {
  CustomFooter("category_body");
  const [showPopUp, activePopUp] = useState(false);
  const [foldersImgs, setFoldersImgs] = useState([]);
  const [columnsData, setColumnsData] = useState([[], [], []]);
  const [folderName, setFolderName] = useState("");

  const popUpToggle = (tag, folderName) => {
    setFolderName(folderName);
    activePopUp((prev) => !prev);

    if (!showPopUp) {
      const imgs = [];
      for (let i = 0; i < 40; i++) {
        imgs.push(
          `http://3rabapp.com/apps/assets/bg-thnumbail/cat${tag}-${i}.png`
        );
      }
      setFoldersImgs(imgs);
      const columns = 3;
      const wrapper = Array.from({ length: columns }, () => []);
      imgs.forEach((img, index) => {
        wrapper[index % columns].push(img);
      });
      setColumnsData(wrapper);
    } else {
      setFoldersImgs([]);
      setColumnsData([[], [], []]);
    }
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosBG.get("/assets/backgrounds.json");
        setData(res?.data?.backgrounds_new);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const lines = [
    {
      mainFolderLine: "folder_line_one",
      folders: [
        { folderClass: "folder_one", folderApi: data[0], tag: 0 },
        { folderClass: "folder_two", folderApi: data[1], tag: 1 },
        { folderClass: "folder_three", folderApi: data[2], tag: 2 },
      ],
    },
    {
      mainFolderLine: "folder_line_two",
      folders: [
        { folderClass: "folder_one", folderApi: data[3], tag: 3 },
        { folderClass: "folder_two", folderApi: data[4], tag: 4 },
      ],
    },
    {
      mainFolderLine: "folder_line_three",
      folders: [
        { folderClass: "folder_one", folderApi: data[5], tag: 5 },
        { folderClass: "folder_two", folderApi: data[6], tag: 6 },
        { folderClass: "folder_two", folderApi: data[7], tag: 7 },
      ],
    },
    {
      mainFolderLine: "folder_line_four",
      folders: [
        { folderClass: "folder_one", folderApi: data[8], tag: 8 },
        { folderClass: "folder_two", folderApi: data[9], tag: 9 },
      ],
    },
  ];

  return (
    <>
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse1" />
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse2" />
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse3" />

      <section className="Category">
        <div className="box">
          <header>
            <div className="box-content">
              <h2>Design that feels right.</h2>
              <h1>Tech that works well.</h1>
            </div>
          </header>

          <div className="folders_container">
            {!loading &&
              lines.map((item, index) => (
                <div key={index} className={item.mainFolderLine}>
                  {item.folders.map((folder, index) => (
                    <button
                      className={`folders ${folder.folderClass}`}
                      onClick={() =>
                        popUpToggle(
                          folder.tag,
                          folder.folderApi?.backgroundsCatName?.en
                        )
                      }
                      key={index}
                    >
                      <img
                        src={`https://3rabapp.com/apps/assets/categories/cat${folder.tag}.png`}
                        alt="folder-img"
                      />
                      <p>{folder.folderApi?.backgroundsCatName?.en}</p>
                    </button>
                  ))}
                </div>
              ))}
          </div>
        </div>
        {showPopUp && (
          <div className="popUp_Container">
            <div className="pop_up">
              <div className="folder_name_close_btn">
                <h6>{folderName}</h6>
                <button onClick={() => popUpToggle()}>
                  <img src={CloseBtnPopUp} alt="" />
                </button>
              </div>
              <div className="images_folder">
                {columnsData.map((col, colIndex) => (
                  <div className="column" key={colIndex}>
                    {col.map((img, imgIndex) => (
                      <img key={imgIndex} src={img} alt="image" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="layer" onClick={() => popUpToggle()}></div>
          </div>
        )}
      </section>
    </>
  );
}

export default Categories;
