/* eslint-disable no-unused-vars */
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./sidePanel.css";

import { TbSend2 } from "react-icons/tb";
import { PiArrowDownRightBold } from "react-icons/pi";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="main-holder">
        <div className="greeting-holder">
          <img src="./img/light-bulb.png" className="img-light" />
          <img src="./img/chair.png" className="img-chair" />
          <div className="text">
            <h1 className="greeting">Good Evening!</h1>
            <p>Welcome to chrommy</p>
          </div>
        </div>
        <div className="page-info-holder">
          <div className="page-info">
            <img
              id="fav-icon"
              src="../assets/icon-32.png"
              alt="Favicon"
              className="fav-icon"
            />
            <div className="more-info">
              <p id="tab-title">Chrommy</p>
              <p id="tab-url">github.com</p>
            </div>
          </div>
          <button className="ac-btn">
            Summarize
            <PiArrowDownRightBold />
          </button>
        </div>
        <div className="chat-box-send-holder">
          <div className="chat-box-send">
            <textarea
              id="chat-input"
              rows="1"
              placeholder="Type a message..."
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
