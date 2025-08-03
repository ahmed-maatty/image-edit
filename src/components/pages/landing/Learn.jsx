import React from "react";
import { CustomFooter } from "../../../hooks/CustomFooter";
import learnHeaderMainPage from "../../../../public/media/Learn/learn.jpg";
import { blogPage } from "../../../json/learn.json";
import { Link } from "react-router-dom";

function Learn() {
  CustomFooter("Learn");
  return (
    <>
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse1" style={{opacity : 1}} />
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse2" style={{opacity : 1}}/>
      <img src="/public/media/imgs/Ellipse 4.png" alt="" className="ellipse3" style={{opacity : 1}}/>
      <section className="Learn_Section">
        <div className="box">
          <header>
            <h1>Kitaba Blog</h1>
            <h5>Know more about design tips & tricks</h5>
            <div className="headerImg">
              <img src={learnHeaderMainPage} alt="" />
              <div className="card">
                <p>feature tag</p>
                <p>main title of the article based on two rows or three rows</p>
                <p>Read more</p>
              </div>
            </div>
          </header>
          <div className="learn_cards">
            {blogPage.map((article, index) => (
              <Link to={"/blogpost"} className="card" key={index}>
                <div className="card_img">
                  <img src={article.image} alt="" />
                </div>
                <p>{article.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Learn;
