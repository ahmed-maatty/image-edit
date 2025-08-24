import { Link, useNavigate } from "react-router-dom";
import Aside from "../fragments/dashboard/Aside";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

function Dashboard() {
  const { active, handleActive, handleSearch } = useDashboardNav();
  const navigate = useNavigate();
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      console.log("Base64 Image:", base64);
      localStorage.setItem("uploadedImage", base64);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
    navigate("/editor");
  };

  return (
    <div className={active ? "dashborad active" : "dashborad"}>
      <Aside />
      <div className="container nobgi">
        <DashboardNav handleActive={handleActive} handleSearch={handleSearch} />
        <div className="swiperInner">
          <div className="sp"></div>
          <Swiper
            slidesPerView={3.5}
            spaceBetween={20}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            centeredSlides={true}
            centerInsufficientSlides={true}
            pagination={{
              el: ".sp",
              clickable: true,
            }}
            breakpoints={{
              200: {
                slidesPerView: 1,
              },
              350: {
                slidesPerView: 1.5,
              },
              1500: {
                slidesPerView: 1.5,
              },
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper3"
          >
            {/* {data.version &&
              Array.from({ length: data.backgrounds_new.length }).map((_, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`https://3rabapp.com/apps/assets/categories/cat${i}.png`}
                    // src={`http://3rabapp.com/apps/assets/bg-thnumbail/cat0-${i}.png`}
                    alt={`Thumbnail ${i}`}
                  />
                </SwiperSlide>
              ))}  */}

            <SwiperSlide>
              <img src="/media/banner.png" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/media/banner.png" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/media/banner.png" alt="" />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="content">
          <div className="discover">
            <div className="discoverLinks discoverLinks2">
              <Link to={"/ai-tools"}>
                <img src="/media/icons/w44.png" alt="" />
                AI tools
              </Link>
              <Link to={"/editor"}>
                <img src="/media/icons/w33.png" alt="" />
                Whiteboard
              </Link>
              <Link to={"/backgrounds"}>
                <img src="/media/icons/w22.png" alt="" />
                Backgrounds
              </Link>
              <button className="upload-btn-editor">
                <label htmlFor="file">
                  <img src="/media/icons/w11.png" alt="" />
                  Upload photo
                </label>
                <input
                  type="file"
                  hidden
                  id="file"
                  name="file"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  accept="image/png,image/jpg,image/jpeg"
                />
              </button>
            </div>
          </div>
          <div className="recent recent2">
            <h3>Quick access </h3>
            <div className="qaccess">
              <Link to={"/generate"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#BA68C8" />
                  <path
                    d="M27 9L25.74 11.75L23 13L25.74 14.26L27 17L28.25 14.26L31 13L28.25 11.75M17 12L14.5 17.5L9 20L14.5 22.5L17 28L19.5 22.5L25 20L19.5 17.5M27 23L25.74 25.74L23 27L25.74 28.25L27 31L28.25 28.25L31 27L28.25 25.74"
                    fill="white"
                  />
                </svg>
                Text to img
              </Link>
              <Link to={"/bg-remover"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#9490DE" />
                  <path
                    d="M15.5001 13.6L13.0001 15L14.4001 12.5L13.0001 10L15.5001 11.4L18.0001 10L16.6001 12.5L18.0001 15L15.5001 13.6ZM27.5001 23.4L30.0001 22L28.6001 24.5L30.0001 27L27.5001 25.6L25.0001 27L26.4001 24.5L25.0001 22L27.5001 23.4ZM30.0001 10L28.6001 12.5L30.0001 15L27.5001 13.6L25.0001 15L26.4001 12.5L25.0001 10L27.5001 11.4L30.0001 10ZM21.3401 20.78L23.7801 18.34L21.6601 16.22L19.2201 18.66L21.3401 20.78ZM22.3701 15.29L24.7101 17.63C25.1001 18 25.1001 18.65 24.7101 19.04L13.0401 30.71C12.6501 31.1 12.0001 31.1 11.6301 30.71L9.29006 28.37C8.90006 28 8.90006 27.35 9.29006 26.96L20.9601 15.29C21.3501 14.9 22.0001 14.9 22.3701 15.29Z"
                    fill="white"
                  />
                </svg>
                Remove BG
              </Link>
              <Link to={"/up-scale"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#F3D34C" />
                  <path
                    d="M24 11H29M29 11V16M29 11L24 16M25 29H27C27.5304 29 28.0391 28.7893 28.4142 28.4142C28.7893 28.0391 29 27.5304 29 27M29 20V23M11 15V13C11 12.4696 11.2107 11.9609 11.5858 11.5858C11.9609 11.2107 12.4696 11 13 11M13 29L17.144 24.856C17.2564 24.7435 17.3898 24.6543 17.5367 24.5934C17.6836 24.5325 17.841 24.5012 18 24.5012C18.159 24.5012 18.3164 24.5325 18.4633 24.5934C18.6102 24.6543 18.7436 24.7435 18.856 24.856L21 27M17 11H20"
                    stroke="white"
                    strokeWidth="2"
                    stroke-linecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 19H12C11.4477 19 11 19.4477 11 20V28C11 28.5523 11.4477 29 12 29H20C20.5523 29 21 28.5523 21 28V20C21 19.4477 20.5523 19 20 19Z"
                    stroke="white"
                    strokeWidth="2"
                    stroke-linecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upscale img
              </Link>
              <Link to={"##"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#BA68C8" />
                  <g clip-path="url(#clip0_420_3122)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.4943 9.52492C12.3694 9.37097 12.2181 9.2456 12.0491 9.15597C11.8801 9.06633 11.6967 9.01419 11.5094 9.00252C11.1311 8.97894 10.7598 9.12163 10.4772 9.3992C10.1946 9.67677 10.0237 10.0665 10.0023 10.4826C9.98086 10.8987 10.1106 11.3071 10.3629 11.6181C11.5586 13.0783 13.0422 14.2184 14.7001 14.9511C14.8905 15.0359 15.082 15.1161 15.2743 15.1915V24.8086C15.0812 24.8837 14.8897 24.9639 14.7001 25.0491C13.0422 25.7817 11.5586 26.9218 10.3629 28.3821C10.1106 28.693 9.98086 29.1014 10.0023 29.5175C10.0129 29.7236 10.0603 29.9253 10.1418 30.1112C10.2233 30.2971 10.3372 30.4635 10.4772 30.6009C10.6171 30.7384 10.7803 30.8441 10.9575 30.9122C11.1346 30.9802 11.3221 31.0093 11.5094 30.9976C11.8877 30.974 12.242 30.7861 12.4943 30.4752C13.4005 29.3712 14.5245 28.51 15.7801 27.9578C17.1033 27.3681 18.5247 27.0923 19.9515 27.1485H20.0472C21.474 27.0923 22.8954 27.3681 24.2186 27.9578C25.5186 28.5423 26.6415 29.4098 27.5043 30.4752C27.7567 30.7863 28.111 30.9744 28.4895 30.9982C28.6768 31.0099 28.8645 30.9809 29.0417 30.9129C29.2189 30.8449 29.3821 30.7391 29.5222 30.6017C29.6622 30.4643 29.7763 30.2978 29.8579 30.1119C29.9394 29.926 29.9869 29.7242 29.9976 29.5181C30.0083 29.312 29.982 29.1056 29.9201 28.9106C29.8583 28.7157 29.7621 28.5361 29.6372 28.3821C28.4415 26.9218 26.9579 25.7817 25.3001 25.0491C25.1104 24.9639 24.9189 24.8837 24.7258 24.8086V15.1915C24.9189 15.1164 25.1104 15.0362 25.3001 14.9511C26.9579 14.2184 28.4415 13.0783 29.6372 11.6181C29.8895 11.3071 30.0192 10.8987 29.9978 10.4826C29.9764 10.0665 29.8056 9.67677 29.5229 9.3992C29.2403 9.12163 28.869 8.97894 28.4907 9.00252C28.1124 9.02609 27.7581 9.21401 27.5058 9.52492C26.5996 10.629 25.4756 11.4901 24.2201 12.0423C22.9201 12.6253 21.4901 12.9066 20.0486 12.8516H19.9529C18.5262 12.9078 17.1047 12.632 15.7815 12.0423C14.5259 11.4901 13.4005 10.629 12.4943 9.52492ZM21.8686 15.9112C21.2484 15.9883 20.6239 16.0156 20.0001 15.9929C19.3762 16.0151 18.7517 15.9872 18.1315 15.9096V24.0873C18.7505 24.0119 19.3734 23.9842 20.0001 24.0041C20.6239 23.9819 21.2484 24.0097 21.8686 24.0873V15.9112Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_420_3122">
                      <rect
                        width="20"
                        height="22"
                        fill="white"
                        transform="translate(10 9)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Zodiac
              </Link>
              <Link to={"##"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#9490DE" />
                  <path
                    d="M22.0732 9.58398L24.5938 8.91113L25.8994 11.1699L28.4854 11.5146L28.8301 14.1006L31.0889 15.4062L30.416 17.9268L32 20L30.416 22.0732L31.0889 24.5938L28.8301 25.8994L28.4854 28.4854L25.8994 28.8301L24.5938 31.0889L22.0732 30.416L20 32L17.9268 30.416L15.4062 31.0889L14.1006 28.8301L11.5146 28.4854L11.1699 25.8994L8.91113 24.5938L9.58398 22.0732L8 20L9.58398 17.9268L8.91113 15.4062L11.1699 14.1006L11.5146 11.5146L14.1006 11.1699L15.4062 8.91113L17.9268 9.58398L20 8L22.0732 9.58398ZM23.2539 19.8584C22.5693 19.8585 22.0304 20.0802 21.6377 20.5234C21.2448 20.9669 21.0488 21.5727 21.0488 22.3408V22.3477C21.0489 23.1113 21.2448 23.7173 21.6377 24.165C22.0304 24.6126 22.5694 24.8359 23.2539 24.8359C23.9385 24.8359 24.4765 24.6126 24.8672 24.165C25.2578 23.7173 25.4531 23.1113 25.4531 22.3477V22.3408C25.4531 21.5727 25.2578 20.9669 24.8672 20.5234C24.4764 20.0802 23.9386 19.8584 23.2539 19.8584ZM22.2734 15.249L16.2686 24.751H17.7363L23.7354 15.249H22.2734ZM23.2539 20.958C23.5173 20.958 23.7198 21.0764 23.8604 21.3135C24.0008 21.5505 24.0703 21.8931 24.0703 22.3408V22.3477C24.0703 22.7997 24.0007 23.1456 23.8604 23.3848C23.7198 23.624 23.5172 23.7432 23.2539 23.7432C22.9864 23.7431 22.7812 23.6238 22.6387 23.3848C22.496 23.1456 22.4248 22.7997 22.4248 22.3477V22.3408C22.4248 21.8931 22.496 21.5505 22.6387 21.3135C22.7812 21.0766 22.9863 20.9581 23.2539 20.958ZM16.7549 15.1641C16.0704 15.1642 15.5307 15.3867 15.1357 15.832C14.7407 16.2776 14.543 16.8827 14.543 17.6465V17.6523C14.543 18.4206 14.7407 19.0281 15.1357 19.4736C15.5307 19.9189 16.0705 20.1415 16.7549 20.1416C17.4394 20.1416 17.9774 19.9189 18.3682 19.4736C18.7588 19.0281 18.9541 18.4206 18.9541 17.6523V17.6465C18.9541 16.8827 18.7588 16.2776 18.3682 15.832C17.9774 15.3866 17.4396 15.1641 16.7549 15.1641ZM16.7549 16.2637C17.0183 16.2637 17.2208 16.3821 17.3613 16.6191C17.5016 16.8561 17.5722 17.2006 17.5723 17.6523V17.6592C17.5723 18.1067 17.5016 18.4502 17.3613 18.6895C17.2208 18.9288 17.0183 19.0488 16.7549 19.0488C16.4873 19.0487 16.2822 18.9286 16.1396 18.6895C15.997 18.4503 15.9258 18.1068 15.9258 17.6592V17.6523C15.9258 17.2006 15.9971 16.8561 16.1396 16.6191C16.2822 16.3823 16.4873 16.2638 16.7549 16.2637Z"
                    fill="white"
                  />
                </svg>
                Summer
              </Link>
              <Link to={"##"}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#F3D34C" />
                  <path
                    d="M19.55 10H11V21.2821H19.55V10ZM29 25.3846H11V30H29V25.3846ZM29 10H23.15V14.1026H29V10ZM29 17.1795H23.15V21.2821H29V17.1795Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                Social media
              </Link>
            </div>
          </div>
          <div className="recent recent2">
            <h3>Recent designs</h3>
            <div className="recent-designs">
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
              <Link to={"##"}>
                <img src="/media/recent.png" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
