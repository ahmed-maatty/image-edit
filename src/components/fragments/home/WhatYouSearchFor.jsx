import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode, Autoplay } from "swiper/modules";
import Bubble from "../Bubble";
function WhatYouSearchFor({ data }) {
  if (!data) return null;
  return (
    <div className="bubbleInner">
      <Bubble position="top-right" />
      <div className="center px0-20L">
        <div className="header">
          <span className="label">What you search for</span>
          <h2>
            Every project. Every need. One <span>template</span> away.
          </h2>
          <p>
            Whether it’s an office doc or a fun invite, make it your own with
            easy customization.
          </p>
        </div>
        {data && (
          <Swiper
            slidesPerView={3.5}
            spaceBetween={30}
            // freeMode={true}
            grabCursor={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              200: {
                slidesPerView: 1,
              },
              350: {
                slidesPerView: 1.25,
              },
              500: {
                slidesPerView: 1.75,
              },
              800: {
                slidesPerView: 2.5,
              },
              1000: {
                slidesPerView: 3.25,
              },
              1500: {
                slidesPerView: 3.5,
              },
            }}
            modules={[FreeMode, Autoplay]}
            className="mySwiper2"
          >
            {data.map((e) => (
              <SwiperSlide key={e.id}>
                <img src={e.image} alt="" />
                <h2>{e.title}</h2>
              </SwiperSlide>
            ))}
            {/* <SwiperSlide>
            <img src="/media/templates/0.png" alt="" />
            <h2>Resume</h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/1.png" alt="" />
            <h2>Invitations</h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/2.png" alt="" />
            <h2>Document</h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/3.png" alt="" />
            <h2>Planner</h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/4.png" alt="" />
            <h2>Poster</h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/5.png" alt="" />
            <h2>Businesscard </h2>
          </SwiperSlide>
          <SwiperSlide>
            <img src="/media/templates/6.png" alt="" />
            <h2>Portfolio</h2>
          </SwiperSlide> */}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default WhatYouSearchFor;
