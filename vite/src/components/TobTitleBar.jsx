import { FiSidebar } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";

import GeminiSVG from "./Gemini";

export default function TopTitleBar({ chatOpen, tabURL }) {
  return (
    <div className="top-title-bar" data-chatOpen={chatOpen}>
      <div className="left">
        <div className="sideBar">
          <button data-sideBarOpen={false}>
            <FiSidebar />
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
