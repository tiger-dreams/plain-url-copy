chrome.action.onClicked.addListener((tab) => {
    if (tab.url.startsWith("chrome://")) {
      // chrome:// URL의 경우 백그라운드에서 처리
      handleChromeUrl(tab.url);
    } else {
      // 일반 웹페이지의 경우 기존 방식대로 처리
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: copyDecodedUrlWithFeedback
      });
    }
  });
  
  function handleChromeUrl(url) {
    const decodedUrl = decodeURI(url);
    navigator.clipboard.writeText(decodedUrl).then(() => {
      console.log('Chrome URL copied: ' + decodedUrl);
      showIconFeedback();
    }).catch(err => {
      console.error('Failed to copy Chrome URL: ', err);
    });
  }
  
  function copyDecodedUrlWithFeedback() {
    const url = window.location.href;
    const decodedUrl = decodeURI(url);
    navigator.clipboard.writeText(decodedUrl).then(() => {
      console.log('Decoded URL copied: ' + decodedUrl);
      showToast();
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  
  function showToast() {
    const toast = document.createElement('div');
    toast.textContent = 'URL이 복사되었습니다!';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      transition: opacity 0.5s ease-in-out;
    `;
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 2000);
  }
  
  function showIconFeedback() {
    chrome.action.setBadgeText({text: "복사"});
    chrome.action.setBadgeBackgroundColor({color: "#4CAF50"});
    setTimeout(() => {
      chrome.action.setBadgeText({text: ""});
    }, 2000);
  }