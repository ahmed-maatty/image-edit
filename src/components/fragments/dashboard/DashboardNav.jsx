import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export function DashboardNav({
  handleActive,
  handleSearch,
  type,
  downloadImage,
  isProfile,
  EditeProfile,
}) {
  const username = Cookies.get("username");

  if (isProfile) {
    if (EditeProfile) {
      return (
        <div className="dashboardNav profileNavBar">
          <div className="dnBtns">
            <button className=" menu2" onClick={handleActive}>
              <Menu />
            </button>
            <Link className="gopro" to={"##"}>
              <Pro />
              Go pro
            </Link>
          </div>
          <div className="profile_nav_userDiv">
            <div className="profile_projects_div">
              <div className="profile_projects_imgs">
                <img src="/media/projects.png" alt="" />
                projects
              </div>
              <p>25</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="dashboardNav profileNavBar">
          <div className="dnBtns">
            <button className=" menu2" onClick={handleActive}>
              <Menu />
            </button>
            <Link className="gopro" to={"##"}>
              <Pro />
              Go pro
            </Link>
          </div>
          <div className="profile_nav_userDiv">
            <div className="avatar">
              <img src="/media/avatar.png" alt="" />
              {username}
            </div>
            <div className="profile_projects_div">
              <div className="profile_projects_imgs">
                <img src="/media/projects.png" alt="" />
                projects
              </div>
              <p>25</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="dashboardNav">
      <div className="dnBtns">
        <button className=" menu2" onClick={handleActive}>
          <Menu />
        </button>
        <Link className="gopro" to={"##"}>
          <Pro />
          Go pro
        </Link>
      </div>
      {type !== 2 ? (
        <Formik
          initialValues={{
            search: "",
          }}
          onSubmit={(values) => {
            handleSearch(values);
          }}
        >
          <Form className="searchInput">
            <Field
              name="search"
              type="search"
              placeholder="Search for background"
            />
            <button>
              <i className="fa-regular fa-magnifying-glass"></i>
            </button>
          </Form>
        </Formik>
      ) : (
        <div className="nav2Btns">
          <button>
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2209 22.13C13.0409 22.13 11.3709 21.3 10.0509 17.33L9.33086 15.17L7.17086 14.45C3.21086 13.13 2.38086 11.46 2.38086 10.28C2.38086 9.11 3.21086 7.43 7.17086 6.1L15.6609 3.27C17.7809 2.56 19.5509 2.77 20.6409 3.85C21.7309 4.93 21.9409 6.71 21.2309 8.83L18.4009 17.32C17.0709 21.3 15.4009 22.13 14.2209 22.13ZM7.64086 7.53C4.86086 8.46 3.87086 9.56 3.87086 10.28C3.87086 11 4.86086 12.1 7.64086 13.02L10.1609 13.86C10.3809 13.93 10.5609 14.11 10.6309 14.33L11.4709 16.85C12.3909 19.63 13.5009 20.62 14.2209 20.62C14.9409 20.62 16.0409 19.63 16.9709 16.85L19.8009 8.36C20.3109 6.82 20.2209 5.56 19.5709 4.91C18.9209 4.26 17.6609 4.18 16.1309 4.69L7.64086 7.53Z"
                fill="#736FD0"
              />
              <path
                d="M10.1108 14.9C9.92078 14.9 9.73078 14.83 9.58078 14.68C9.29078 14.39 9.29078 13.91 9.58078 13.62L13.1608 10.03C13.4508 9.74 13.9308 9.74 14.2208 10.03C14.5108 10.32 14.5108 10.8 14.2208 11.09L10.6408 14.68C10.5008 14.83 10.3008 14.9 10.1108 14.9Z"
                fill="#736FD0"
              />
            </svg>
            Share
          </button>
          <button onClick={downloadImage}>
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16.5L7 11.5L8.4 10.05L11 12.65V4.5H13V12.65L15.6 10.05L17 11.5L12 16.5ZM6 20.5C5.45 20.5 4.97933 20.3043 4.588 19.913C4.19667 19.5217 4.00067 19.0507 4 18.5V15.5H6V18.5H18V15.5H20V18.5C20 19.05 19.8043 19.521 19.413 19.913C19.0217 20.305 18.5507 20.5007 18 20.5H6Z"
                fill="#736FD0"
              />
            </svg>
            Download
          </button>
        </div>
      )}
      <Link className="avatar" to={"/profile"}>
        <img src="/media/avatar.png" alt="" />
        {username}
      </Link>
    </div>
  );
}

function Menu() {
  return (
    <svg
      width="52"
      height="51"
      viewBox="0 0 52 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_662_5799)">
        <g clipPath="url(#clip0_662_5799)">
          <rect x="6" y="3.5" width="40" height="40" rx="6" fill="#F3D34C" />
          <path
            d="M35 19.25H17C16.59 19.25 16.25 18.91 16.25 18.5C16.25 18.09 16.59 17.75 17 17.75H35C35.41 17.75 35.75 18.09 35.75 18.5C35.75 18.91 35.41 19.25 35 19.25Z"
            fill="#3E3C37"
          />
          <path
            d="M35 24.25H17C16.59 24.25 16.25 23.91 16.25 23.5C16.25 23.09 16.59 22.75 17 22.75H35C35.41 22.75 35.75 23.09 35.75 23.5C35.75 23.91 35.41 24.25 35 24.25Z"
            fill="#3E3C37"
          />
          <path
            d="M35 29.25H17C16.59 29.25 16.25 28.91 16.25 28.5C16.25 28.09 16.59 27.75 17 27.75H35C35.41 27.75 35.75 28.09 35.75 28.5C35.75 28.91 35.41 29.25 35 29.25Z"
            fill="#3E3C37"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_662_5799"
          x="0.5"
          y="0"
          width="51"
          height="51"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.25098 0 0 0 0 0.223529 0 0 0 0 0.0431373 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_662_5799"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_662_5799"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_662_5799">
          <rect x="6" y="3.5" width="40" height="40" rx="6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Pro() {
  return (
    <svg
      width="28"
      height="29"
      viewBox="0 0 28 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.59771 25.5H22.4011M13.4737 3.81649C13.5255 3.72064 13.6016 3.64071 13.6941 3.58504C13.7865 3.52937 13.892 3.5 13.9994 3.5C14.1068 3.5 14.2123 3.52937 14.3047 3.58504C14.3972 3.64071 14.4733 3.72064 14.5251 3.81649L18.0682 10.6685C18.1527 10.8272 18.2706 10.9648 18.4135 11.0716C18.5564 11.1783 18.7208 11.2515 18.8947 11.2858C19.0687 11.3202 19.2479 11.3149 19.4196 11.2703C19.5913 11.2258 19.7512 11.143 19.8878 11.028L25.0212 6.54802C25.1198 6.46637 25.2412 6.41868 25.368 6.41181C25.4949 6.40495 25.6206 6.43926 25.7271 6.50981C25.8336 6.58036 25.9153 6.68351 25.9606 6.80441C26.0059 6.92531 26.0123 7.05773 25.979 7.18261L22.5775 19.7105C22.5081 19.9668 22.3585 20.1931 22.1514 20.3551C21.9444 20.5171 21.6911 20.6058 21.4301 20.6079H6.56991C6.30866 20.6061 6.05514 20.5174 5.84784 20.3555C5.64053 20.1935 5.49077 19.967 5.42128 19.7105L2.021 7.18383C1.98769 7.05896 1.99414 6.92654 2.03941 6.80563C2.08468 6.68473 2.16645 6.58158 2.27293 6.51103C2.37941 6.44048 2.50512 6.40617 2.63197 6.41304C2.75881 6.4199 2.88025 6.46759 2.97879 6.54924L8.11102 11.0292C8.2476 11.1442 8.40749 11.227 8.57919 11.2716C8.75089 11.3161 8.93015 11.3214 9.1041 11.2871C9.27805 11.2527 9.44237 11.1795 9.58527 11.0728C9.72816 10.9661 9.84609 10.8284 9.93058 10.6698L13.4737 3.81649Z"
        stroke="#736FD0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
