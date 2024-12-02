import { FiSidebar } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";
import { BsMenuButtonWide } from "react-icons/bs";
import GeminiSVG from "./Gemini";
import { CgMenuLeftAlt } from "react-icons/cg";

export default function TopTitleBar({
  chatOpen,
  tabURL,
  toogleSlideBar,
  slideBarOpen,
}) {
  return (
    <div className="top-title-bar" data-chatOpen={chatOpen}>
      <div className="left">
        <div className="sideBar">
          <button data-sideBarOpen={slideBarOpen} onClick={toogleSlideBar}>
            <CgMenuLeftAlt />
          </button>
        </div>
        <div className="info">
          <div className="title">
            <h1>Chrommy</h1>
            <div className="nano-logo-holder">
              <div className="nano-logo">
                <GeminiSVG />
                <p className="def-nano-logo-txt">Gemini Nano</p>
              </div>
            </div>
          </div>
          <div className="tab">{tabURL}</div>
        </div>
      </div>
      <div className="right">
        <div className="ac-btns">
          <button>
            <IoSettingsOutline />
          </button>
          <button>
            <FiGithub />
          </button>
        </div>
      </div>
    </div>
  );
}
