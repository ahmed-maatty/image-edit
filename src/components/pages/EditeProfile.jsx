import React, { useEffect, useState } from "react";
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";
import { AxiosInstance } from "../../api/axios";
import Cookies from "js-cookie";

function EditeProfile() {
  const { active, handleActive } = useDashboardNav();
  const [user, setUser] = useState(null);
  const getUserInfo = async () => {
    const res = await AxiosInstance.get("/member-info", {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    console.log(res);
    console.log(Cookies.get("token"))
  };

  useEffect(() => {
    getUserInfo()
  }, []);

  return (
    <div
      className={
        active
          ? "dashborad editorPage active "
          : "dashborad editorPage profilePage"
      }
    >
      {/* <Aside /> */}
      <div className="editor">
        <DashboardNav
          handleActive={handleActive}
          isProfile={true}
          EditeProfile={true}
        />
        <div className="my_profile_info">
          <div className="profile_img">
            <p>Edit profile</p>
            <div className="img_containter">
              <label htmlFor="file">
                <img src="/media/mdi_camera-outline.png" alt="" />{" "}
                <div className="layer"></div>
              </label>
              <input type="file" name="file" id="file" />
              <img src="/media/avatar.png" alt="" />
            </div>
          </div>
          <div className="user_data">
            <div className="user_main_data">
              <p>Profile details</p>
              <div>
                <label htmlFor="">Name</label>
                <input type="text" placeholder="write your name" value={""} />
              </div>
              <div>
                <label htmlFor="">User name</label>
                <input
                  type="text"
                  placeholder="write your username"
                  value={"Ahmedibrahim"}
                />
              </div>
              <div>
                <label htmlFor="">Your mail</label>
                <input
                  type="text"
                  placeholder="write your email"
                  value={"My mail@mail.com"}
                />
              </div>
              <div>
                <label htmlFor="">Phone</label>
                <input type="text" placeholder="write your phone" value={""} />
              </div>
              <div>
                <label htmlFor="">Gender</label>
                <select name="" id="">
                  <option value="">Choose your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Birthday</label>
                <input type="date" />
              </div>
            </div>
            <div className="user_social_account">
              <p>My social media account</p>
              <div>
                <label htmlFor="">Facebook</label>
                <input type="text" value={"Ahmedibrahim"} />
              </div>
              <div>
                <label htmlFor="">Scapchat</label>
                <input type="text" value={"My mail@mail.com"} />
              </div>
              <div>
                <label htmlFor="">Instagram</label>
                <input type="text" value={"My mail@mail.com"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditeProfile;
