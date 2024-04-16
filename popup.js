  // popup.js
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'startGrabbing' });

  });
});

