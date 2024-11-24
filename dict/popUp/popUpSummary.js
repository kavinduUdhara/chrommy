console.log("popUpSummary.js loaded");

chrome.action.onClicked.addListener(async (tab) => {
  console.log('Tab info:', tab);

  // Set side panel options dynamically
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: "sidePanel/index.html",
    enabled: true // Ensure it's explicitly enabled
  });

  console.log("Side panel opened.");
});

function openPopUpSummary() {
  const url = window.location.href;

  const popUpSummaryHTML = `
  <div class="chrommy-pop-up-holder" style="
   position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 0rem;
    display: flex;
    justify-content: flex-end;
    background-color: black;
    z-index: 1000000000;
  ">
    <div class="chrommy-pop-up" style="
    padding: 10px;
    width: 100%;
    height: auto;
    position: absolute;
    max-width: 32rem;">
      <div class="chrommy-pop-up-content" style="
      background-color: rgba(255, 255, 255, 0.795);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      ">
        <h2>Page Summary</h2>
        <p>
          URL:
          ${url}
        </p>
        <button>Close</button>
      </div>
    </div>
  </div>
  `;
;

  // Inject the HTML string into the body of the page
  const popUpElement = document.createElement("div");
  popUpElement.innerHTML = popUpSummaryHTML;
  document.body.appendChild(popUpElement);
}