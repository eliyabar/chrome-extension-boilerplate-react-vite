import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

reloadOnUpdate('pages/background');

console.log('background loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`${JSON.stringify(request)} ${JSON.stringify(sender)}`);
  if (request.capture) {
    chrome.tabs.captureVisibleTab(
      chrome.windows.WINDOW_ID_CURRENT,
      { format: 'png', quality: 80 },
      function (data) {
        sendResponse({ image: data });
      }
    );
    return true;
  }
});
