import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordionCustom";
import { PiGoogleChromeLogo } from "react-icons/pi";
import { SiMacos } from "react-icons/si";
import { FaLinux } from "react-icons/fa6";
import {
  TbBrandWindows,
  TbCheckupList,
  TbInfoTriangle,
  TbMapExclamation,
  TbUserQuestion,
} from "react-icons/tb";

export function ErrorOptions({ errorMsg, errorTitle, errorStatus }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {errorTitle && (
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex gap-2 items-center overflow-hidden">
              <div className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center p-[2px]">
                <TbUserQuestion />
              </div>
              <h1 className="max-w-full text-nowrap text-ellipsis">
                What you can do?
              </h1>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {errorTitle === "Unsupported Browser" && (
              <div className="what-to-do-step-holder">
                <p>
                  <b>
                    {" "}
                    Download <PiGoogleChromeLogo /> Chrome Dev channel
                  </b>{" "}
                  (or Canary channel), and confirm that your version is equal or
                  newer than 128.0.6545.0.
                </p>
                <div className="note">
                  <p>
                    <TbInfoTriangle />
                    Check that your device meets the requirements. (on the
                    Requirements section)
                  </p>
                </div>
                <div className="step-budge">Step 1</div>
              </div>
            )}
            {errorTitle === "Prompt API Unavailable" && (
              <div className="what-to-do-step-holder">
                <p>
                  1. Open a new tab in <PiGoogleChromeLogo /> Chrome, go to{" "}
                  <a
                    href="chrome://flags/#optimization-guide-on-device-model"
                    target="_blank"
                  >
                    <code>
                      chrome://flags/#optimization-guide-on-device-model
                    </code>
                  </a>
                  .
                </p>
                <p>
                  2. Select <code>Enabled BypassPerfRequirement</code>
                </p>
                <p>
                  3. Go to{" "}
                  <code>chrome://flags/#prompt-api-for-gemini-nano</code>
                </p>
                <p>
                  4. Select <code> Enabled</code>
                </p>
                <p>
                  5. Relaunch <PiGoogleChromeLogo /> Chrome.
                </p>
                <div className="note">
                  <p>
                    <TbInfoTriangle />
                    Check that your device meets the requirements. (on the
                    Requirements section)
                  </p>
                </div>
                <div className="step-budge">Step 2</div>
              </div>
            )}
            {errorTitle === "Built-in AI Not Ready" && (
              <div className="what-to-do-step-holder">
                <p>
                  <b>
                    {" "}
                    First Try Reloading the <PiGoogleChromeLogo /> browser for
                    several times
                  </b>
                </p>
                <button className="bg-zinc-900 w-fit p-1 px-2 rounded-md text-white" onClick={() => {window.location.reload();}}>
                  Realod the page
                </button>
                <p>If it did not work,</p>
                <p>
                  1. Force <PiGoogleChromeLogo /> Chrome to recognize that you
                  want to use this API. To do so, open DevTools and send{" "}
                  <code> await ai.languageModel.create();</code>
                  in the console. This will likely fail but it’s intended.
                </p>
                <p>2. Relaunch Chrome.</p>
                <p>
                  3. Open a new tab in Chrome, go to{" "}
                  <code> chrome://components </code>
                </p>
                <p>
                  4. Confirm that Gemini Nano is either available or is being
                  downloaded
                </p>
                <div className="pl-2">
                  <p>
                    - You'll want to see the{" "}
                    <code> Optimization Guide On Device Model</code>
                    present with a version greater or equal to{" "}
                    <code> 2024.5.21.1031.</code>
                  </p>
                  <p>
                    - If there is no version listed, click on{" "}
                    <code> Check for update</code> to force the download.
                  </p>
                </div>
                <p>
                  If this still failing, please see the{" "}
                  <a
                    href="https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit#heading=h.opavs8dwyfke"
                    target="_blank"
                  >
                    {" "}
                    troubleshooting section.
                  </a>
                </p>
                <div className="note">
                  <p>
                    <TbInfoTriangle />
                    Check that your device meets the requirements. (on the
                    Requirements section)
                  </p>
                </div>
                <div className="step-budge">Step 3</div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex gap-2 items-center overflow-hidden">
            <div className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center p-[3px]">
              <TbMapExclamation />
            </div>
            <h1 className="max-w-full text-nowrap text-ellipsis">
              Step by step guide
            </h1>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="steps-list">
            <div className="step">
              <div className="step-no">1</div>
              <div className="step-info">
                <h1>Prerequisites</h1>
                <div className="what-to-do-step-holder">
                  <p>
                    <b>
                      {" "}
                      Download <PiGoogleChromeLogo /> Chrome Dev channel
                    </b>{" "}
                    (or Canary channel), and confirm that your version is equal
                    or newer than 128.0.6545.0.
                  </p>
                  <div className="note">
                    <p>
                      <TbInfoTriangle />
                      Check that your device meets the requirements. (on the
                      Requirements section)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-no">2</div>
              <div className="step-info">
                <h1>Enable Gemini Nano and the Prompt API</h1>
                <div className="what-to-do-step-holder">
                  <p>
                    1. Open a new tab in <PiGoogleChromeLogo /> Chrome, go to{" "}
                    <a
                      href="chrome://flags/#optimization-guide-on-device-model"
                      target="_blank"
                    >
                      <code>
                        chrome://flags/#optimization-guide-on-device-model
                      </code>
                    </a>
                    .
                  </p>
                  <p>
                    2. Select <code>Enabled BypassPerfRequirement</code>
                  </p>
                  <p>
                    3. Go to{" "}
                    <code>chrome://flags/#prompt-api-for-gemini-nano</code>
                  </p>
                  <p>
                    4. Select <code> Enabled</code>
                  </p>
                  <p>
                    5. Relaunch <PiGoogleChromeLogo /> Chrome.
                  </p>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-no">3</div>
              <div className="step-info">
                <h1>Confirm availability of Gemini Nano</h1>
                <div className="what-to-do-step-holder">
                  <p>
                    1. Open DevTools and send
                    <code>
                      (await ai.languageModel.capabilities()).available;
                    </code>{" "}
                    in the console.
                  </p>
                  <p>
                    2. If this returns <code>“readily”</code>, then you are all
                    set.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <div className="flex gap-2 items-center overflow-hidden">
            <div className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center p-[3px]">
              <TbCheckupList />
            </div>
            <h1 className="max-w-full text-nowrap text-ellipsis">
              Requirements
            </h1>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="spe-list">
            <div className="spe">
              <div className="title">OS Version</div>
              <div className="info">
                <p>
                  <TbBrandWindows /> Windows 10 or 11
                </p>
                <p>
                  <SiMacos /> MacOS 13 or newer
                </p>
                <p>
                  <FaLinux /> Linux not specified
                </p>
              </div>
            </div>
            <div className="spe">
              <div className="title">Storage</div>
              <div className="info">
                <p>
                  At least 22 GB on the volume that contains your Chrome
                  profile.
                </p>
                <div className="note mt-0 mb-0">
                  <TbInfoTriangle className="inline-block mr-1" />
                  Note that the model requires a lot less storage, it’s just for
                  the sake of having an ample storage margin. If after the
                  download the available storage space falls below 10 GB, the
                  model will be deleted again.
                </div>
              </div>
            </div>
            <div className="spe">
              <div className="title">GPU</div>
              <div className="info">
                <p>Integrated GPU, or discrete GPU (e.g. video card).</p>
              </div>
            </div>
            <div className="spe">
              <div className="title">Video RAM</div>
              <div className="info">
                <p>4 GB (minimum)</p>
              </div>
            </div>
            <div className="spe">
              <div className="title">Network connection</div>
              <div className="info">
                <p>A non-metered connection</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
