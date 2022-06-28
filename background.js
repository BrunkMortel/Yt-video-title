uuid = "No token found"
server_url = "https://Yt-chapters-extension.omega77073.repl.co"
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension isntalled")
    chrome.storage.sync.set({uuid});
    chrome.storage.sync.set({server_url});
});

