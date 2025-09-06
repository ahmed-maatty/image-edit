import React from 'react';
import { useDashboardNav } from "../../hooks/DashboardNavHook";
import { DashboardNav } from "../fragments/dashboard/DashboardNav";

function EditeProfile() {
  const { active, handleActive } = useDashboardNav();
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
        <DashboardNav handleActive={handleActive} isProfile={true} EditeProfile={true} />
        
      </div>
    </div>
  )
}

export default EditeProfile