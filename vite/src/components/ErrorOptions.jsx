import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordionCustom";
import { PiGoogleChromeLogo } from "react-icons/pi";
import {
  TbCheckupList,
  TbInfoTriangle,
  TbMapExclamation,
  TbUserQuestion,
} from "react-icons/tb";

export function ErrorOptions({ errorMsg, errorTitle }) {
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
                  <a href="chrome://flags/#optimization-guide-on-device-model" target="_blank">
                  <code>
                    chrome://flags/#optimization-guide-on-device-model
                  </code></a>
                  .
                </p>
                <p>2. Select <code>Enabled BypassPerfRequirement</code></p>
                <p>3. Go to <code>chrome://flags/#prompt-api-for-gemini-nano</code></p>
                <p>4. Select <code> Enabled</code></p>
                <p>5. Relaunch <PiGoogleChromeLogo/> Chrome.</p>
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
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
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
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
