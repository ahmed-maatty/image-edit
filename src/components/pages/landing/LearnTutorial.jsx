import React from "react";
import { useShowOption } from "../../../hooks/ShowOptionProvider";
import learnTutorial from "../../../json/learnTutorial.json";

function LearnTutorial() {
  const { setShow, setOption } = useShowOption();
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
            {learnTutorial.map((article, index) => (
              <div className="tutorial_Content" key={index}>
                <div className="tutorial_img">
                  <img src={article.image} alt="" />
                </div>
                <div className="toturial_main_content">
                  <h1>{article.title}</h1>
                  {article.steps.map((step) => (
                    <div className="steps">
                      <p className="p-key">{step.key} </p>
                      <p className="p-values"> {step.value}</p>
                    </div>
                  ))}
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
