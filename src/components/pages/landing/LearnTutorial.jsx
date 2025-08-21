import React, { useEffect, useState } from "react";
import { useShowOption } from "../../../hooks/ShowOptionProvider";
//import learnTutorial from "../../../json/learnTutorial.json";
import { handleError } from "../../../api/error";
import { AxiosInstance } from "../../../api/axios";

function LearnTutorial() {
  const { setShow, setOption } = useShowOption();
  const [learnTutorial, setTutorial] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/videos");
        setTutorial(res?.data?.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  console.log(learnTutorial);
  return (
    <>
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse1"
        style={{ opacity: 1 }}
      />
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse2"
        style={{ opacity: 1 }}
      />
      <img
        src="/media/imgs/Ellipse 4.png"
        alt=""
        className="ellipse3"
        style={{ opacity: 1 }}
      />
      <div className="hero">
        <div className="box">
          <div className="bx">
            <div>
              <h1>Kitaba Tutorial</h1>
              <p className="learnTutorial">
                Know more about design tips & tricks
              </p>
            </div>
            <button
              className="btn btn2"
              onClick={() => {
                setShow(true);
                setOption("signup");
              }}
            >
              Start design
            </button>
          </div>

          <img
            className="heroImg heroLearnImg"
            src="/media/imgs/Group.png"
            alt=""
          />
        </div>
        <img className="bg" src="/media/imgs/Hero.png" alt="" />
      </div>
      <section className="LearnTutorial">
        <div className="box">
          <div className="tutorial_Content_Container">
            {learnTutorial.map((article) => (
              <div className="tutorial_Content" key={article.id}>
                <div
                  className="tutorial_img"
                  dangerouslySetInnerHTML={{ __html: article.video }}
                ></div>
                <div className="toturial_main_content">
                  <h1>{article.title}</h1>
                  <div
                    className="steps"
                    dangerouslySetInnerHTML={{ __html: article.body }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default LearnTutorial;
