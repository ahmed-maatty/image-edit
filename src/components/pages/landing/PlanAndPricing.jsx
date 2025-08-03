import React from "react";
import { Link } from "react-router-dom";
import { CustomFooter } from "../../../hooks/CustomFooter";
import pricesData from "../../../json/prices.json";

function PlanAndPricing() {
  CustomFooter("Plan_Pricing");
  return (
    <>
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse1" />
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse2" />
      <img src="/media/imgs/Ellipse 4.png" alt="" className="ellipse3" />
      <section className="Plan_Pricing_Section">
        <div className="box">
          <header>
            <div className="box-content">
              <h2>Better Design in less time</h2>
              <h1>Try our plans now.</h1>
            </div>
          </header>
          <div className="Prices_Container">
            {pricesData.map((data, index) => (
              <div className="column" key={index}>
                <h1 className="plan_price">{data.plan}</h1>
                <p className="plan_description">{data.description}</p>
                <h1 className="plan_main_price">{data.price}</h1>
                <button className="plan_btn">{data.buttonText}</button>
                <div className="plan_Features">
                  {
                    data.features.map((feature,index)=>(
                      <span key={index}>
                        <img src={feature.Img} alt="" />
                        <p>{feature.text}</p>
                        {
                          feature.beta && <p className="beta"> Beta </p>
                        }
                      </span>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default PlanAndPricing;
