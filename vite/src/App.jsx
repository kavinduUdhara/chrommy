/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./sidePanel.css";

import { TbSend2 } from "react-icons/tb";
import { PiArrowDownRightBold } from "react-icons/pi";
import { FiSidebar } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";
import { SiGooglegemini } from "react-icons/si";

import {
  loadTheActiveTabInfo,
  checkFaviconBrightness,
  getGreeting,
} from "./AppFunctions";

function App() {
  const [tabInfo, setTabInfo] = useState({
    tab: "Chrommy",
    domain: "localhost",
    favicon: "../../dict/assets/icon-32.png",
    isFaviconBright: false,
  });
  const [textBox, setTextBox] = useState({
    text: "",
    cmds: ["Summarize Tab", "Coppied"],
    context: "Chrommy side pannel",
    placeholder: "Tell me more about...",
  });

  // useEffect(() => {
  //   const fetchTabInfo = async () => {
  //     try {
  //       const tabInfo = await loadTheActiveTabInfo();
  //       setTabInfo(tabInfo);
  //       if (tabInfo.favicon) {
  //         const isFaviconBright = await checkFaviconBrightness(tabInfo.favicon);
  //         setTabInfo((prevTabInfo) => ({ ...prevTabInfo, isFaviconBright }));
  //       }
  //     } catch (error) {
  //       console.error("Error loading tab info:", error);
  //     }
  //   };

  //   fetchTabInfo();
  // }, []);

  const handleSummarizeButton = () => {
    setTextBox({
      ...textBox,
      cmds: ["Summarize Tab"],
      context: tabInfo.tab,
      placeholder: "Give me top 3 takeaways from...",
    });
  };

  return (
    <>
      <div className="main-holder chat-open">
        <div className="greeting-holder" data-chatOpen={true}>
          <img src="./img/light-bulb.png" className="img-light" />
          <img src="./img/chair.png" className="img-chair" />
          <div className="text">
            <h1 className="greeting">{getGreeting()}</h1>
            <p>Welcome to chrommy</p>
          </div>
        </div>
        <div className="page-info-holder" data-chatOpen={true}>
          {Object.keys(tabInfo).length === 0 ? (
            <div className="page-info">
              <div className="def-loading-box w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="flex flex-col">
                <p
                  id="tab-title"
                  className="def-loading-box w-20 h-5 bg-slate-200"
                ></p>
                <p
                  id="tab-url"
                  className="def-loading-box w-10 h-3 bg-slate-200"
                ></p>
              </div>
            </div>
          ) : (
            <div className="page-info">
              {/* <img
                id="fav-icon"
                src={tabInfo.favicon || "../assets/icon-32.png"}
                alt="Favicon"
                className={`fav-icon ${tabInfo.isFaviconBright ? "dark" : ""}`}
              />
              <div className="more-info">
                <p id="tab-title">{tabInfo.tab}</p>
                <p id="tab-url">{tabInfo.domain}</p>
              </div> */}
              <div className="top-title-bar">
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
                          {" "}
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            role="img"
                            viewBox="0 0 24 24"
                            class="#gradientSVG"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              <linearGradient
                                id="grad1"
                                x1="0%"
                                x2="100%"
                                y1="0%"
                                y2="0%"
                              >
                                <stop offset="0%" stop-color="#0a88b2" />
                                <stop offset="100%" stop-color="#1e2f97" />
                              </linearGradient>
                            </defs>
                            <path
                              fill="url(#grad1)"
                              d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
                            ></path>
                          </svg>{" "}
                          <p>Gemini Nano</p>
                        </div>
                      </div>
                    </div>
                    <div className="tab">example.com</div>
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
            </div>
          )}
          <button className="ac-btn" onClick={handleSummarizeButton}>
            Summarize
            <PiArrowDownRightBold />
          </button>
        </div>
        <div class="chat-history-holder" data-chatOpen={true}>
          <div class="chat user">
            <div class="context">
              <span class="cmd">Summarize Tab</span> Built-in AI
            </div>
            <div class="text">what is the core concept here</div>
          </div>
          <div class="chat system">
            <div class="text">
              This is a welcome notice to the Brand Resource Center. It informs
              visitors that the center provides guidance on using their logo,
              product icons, and other brand elements for various purposes, such
              as marketing, design, and education. It emphasizes that the
              resource is available to anyone who needs to use their brand
              assets effectively.
            </div>
          </div>
          <div class="chat user">
            <div class="context">
              <span class="cmd">Summarize Tab</span> Built-in AI
            </div>
            <div class="text">what is the core concept here</div>
          </div>
          <div class="chat system">
            <div class="text">
              This is a welcome notice to the Brand Resource Center. It informs
              visitors that the center provides guidance on using their logo,
              product icons, and other brand elements for various purposes, such
              as marketing, design, and education. It emphasizes that the
              resource is available to anyone who needs to use their brand
              assets effectively.
            </div>
          </div>
          <div class="chat user">
            <div class="context">
              <span class="cmd">Summarize Tab</span> Built-in AI
            </div>
            <div class="text">what is the core concept here</div>
          </div>
          <div class="chat system">
            <div class="text">
              This is a welcome notice to the Brand Resource Center. It informs
              visitors that the center provides guidance on using their logo,
              product icons, and other brand elements for various purposes, such
              as marketing, design, and education. It emphasizes that the
              resource is available to anyone who needs to use their brand
              assets effectively.
            </div>
          </div>
        </div>
        <div className="chat-box-send-holder">
          {textBox.context && (
            <div class="context">
              <div class="icon"></div>
              <div class="text">
                {textBox.cmds.length > 0 &&
                  textBox.cmds.map((cmd) => (
                    <span class="cmd">{cmd}</span>
                  ))}{" "}
                {textBox.context}
              </div>
            </div>
          )}
          <div className="chat-box-send">
            <textarea
              id="chat-input"
              rows="1"
              placeholder={textBox.placeholder}
              value={textBox.text}
              onChange={(e) => setTextBox({ ...textBox, text: e.target.value })}
            ></textarea>
            <button id="send-btn">
              <TbSend2 />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
