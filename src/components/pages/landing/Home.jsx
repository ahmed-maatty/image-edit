import { useEffect, useState } from "react";
import { AxiosInstance } from "../../../api/axios";
import { handleError } from "../../../api/error";
import GoTop from "../../fragments/GoTop";
import Counters from "../../fragments/home/Counters";
import Features from "../../fragments/home/Features";
import Hero from "../../fragments/home/Hero";
import NewFeatures from "../../fragments/home/NewFeatures";
import Pricing from "../../fragments/home/Pricing";
import WhatYouSearchFor from "../../fragments/home/WhatYouSearchFor";
function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/home_data");
        setData(res.data.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <GoTop />
      <Hero />
      <Counters data={data?.settings} />
      <Features data={data?.main_features} />
      <Pricing />
      <NewFeatures data={data?.services} />
      <WhatYouSearchFor data={data?.features}/>
    </>
  );
}

export default Home;
