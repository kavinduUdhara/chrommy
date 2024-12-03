import { FiSidebar } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";
import { BsMenuButtonWide } from "react-icons/bs";
import GeminiSVG from "./Gemini";
import { CgMenuLeftAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

import { AlertRedirectToGitHub } from "./AlertRedirectToGItHub";
import { SettingsPopUp } from "./SettingsPopUp";

export default function TopTitleBar({
  chatOpen,
  tabURL,
  toogleSlideBar,
  slideBarOpen,
}) {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/sidePanel/");
  };
  
  return (
    <div className="top-title-bar" data-chatOpen={chatOpen}>
      <div className="left">
        <div className="sideBar">
          <button data-sideBarOpen={slideBarOpen} onClick={toogleSlideBar}>
            <CgMenuLeftAlt />
          </button>
        </div>
        <button className="info" onClick={navigateHome}>
          <div className="title">
            <button>Chrommy</button>
            <div className="nano-logo-holder">
              <div className="nano-logo">
                <GeminiSVG />
                <p className="def-nano-logo-txt">Gemini Nano</p>
              </div>
            </div>
          </div>
          <div className="tab">{tabURL}</div>
        </button>
      </div>
      <div className="right">
        <div className="ac-btns">
          <SettingsPopUp>
            <button>
              <IoSettingsOutline /><div className="sr-only">settings</div>
            </button>
          </SettingsPopUp>
          <AlertRedirectToGitHub>
            <button>
              <FiGithub /><div className="sr-only">github</div>
            </button>
          </AlertRedirectToGitHub>
        </div>
      </div>
    </div>
  );
}
