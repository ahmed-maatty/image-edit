import { Link } from "react-router-dom";
import Bubble from "../Bubble";
import { useEffect, useState } from "react";
import { GlowEffect } from "../../../hooks/GlowEffect";
import { useShowOption } from "../../../hooks/ShowOptionProvider";
import { AxiosInstance } from "../../../api/axios";
import { handleError } from "../../../api/error";
function Pricing() {
  useEffect(() => {
    GlowEffect();
  }, []);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/packages");
        setData(res.data.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  const { setShow, setOption } = useShowOption();

  if (!data) return null;

  return (
    <div className="bubbleInner">
      <Bubble position="top-left" />
      <div className="box center">
        <div className="header">
          <span className="label"> Pricing</span>
          <h2>
            Our <span>Subscription</span> Plans
          </h2>
        </div>
        <div className="plans">
          {data.map((e) => (
            <div className="plan glow" key={e.id}>
              <h2>{e.title}</h2>
              {/* <span>{e.title}</span> */}
              <h3>{e.price}</h3>
              <button
                onClick={() => {
                  setShow(true);
                  setOption("signup");
                }}
                className="btn w100"
              >
                {e.price == "0.00" ? "Register now" : "Subscribe now"}
              </button>
            </div>
          ))}
          {/* <div className="plan glow">
            <h2>Free</h2>
            <span>For any kind of project or design work.</span>
            <h3>00.00</h3>
            <button
              onClick={() => {
                setShow(true);
                setOption("signup");
              }}
              className="btn w100"
            >
              Register now
            </button>
          </div>
          <div className="plan glow">
            <h2>Monthly</h2>
            <span>auto-renewing subscription</span>
            <h3>19.99</h3>
            <Link to={"/"} className="btn w100">
              Subscribe now
            </Link>
          </div>
          <div className="plan glow">
            <h2>Yearly</h2>
            <span>auto-renewing subscription</span>
            <h3>49.99</h3>
            <Link to={"/"} className="btn w100">
              Subscribe now
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
