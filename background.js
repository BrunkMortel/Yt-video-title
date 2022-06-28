uuid = "No token found";
server_url = "https://Yt-chapters-extension.omega77073.repl.co";
enabled = false

display_title = true
display_chapters = true

function scan() {
  chrome.storage.sync.get("uuid", ({ uuid }) => {
    if (uuid == "No token found") {
      console.log("No token found");
      return;
    }
    chrome.storage.sync.get("server_url", ({ server_url }) => {
      let url = window.location.href;
      let domain = new URL(url);
      domain = domain.hostname.replace("www.", "");
      console.log(domain, server_url, uuid);
      if (!domain == "youtube.com") {
        console.log("This plugin only works for youtube.com");
        return;
      }

      async function updateText(text, title,te,ce) {
        if(ce == false){
          text = ""
        }
        if(te == false){
          title = ""
        }

        document.getElementById("display_title").innerHTML = title
        document.getElementById("display_chapters").innerHTML = text

        console.log("Updating text:", text);
        let rawResponse = await fetch(server_url + "/update", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text, uuid: uuid, title: title }),
        });
      }
      last_text = "";
      last_title = "";
      last_chapters = null;
      last_titlee = null;
      setInterval(() => {
        chrome.storage.sync.get("enabled", async ({ enabled }) => {
          if (enabled == true) {
            //Merci Brunk_Mortel pour la query
            
            let title_enabled = await chrome.storage.sync.get("display_title")
            title_enabled =  title_enabled.display_title
            let chapters_enabled = await chrome.storage.sync.get("display_chapters")
            chapters_enabled = chapters_enabled.display_chapters

            let chapterName =
              document.querySelector(
                "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-chapter-container > button > div.ytp-chapter-title-content"
              ).innerText || "No chapters found";
            let title = document.querySelector(
              ".title.ytd-video-primary-info-renderer > yt-formatted-string.style-scope.ytd-video-primary-info-renderer"
            ).innerHTML;

            if (!chapterName) {
              //On peut essayer de récup des trucs?
            } else {
              if (chapterName != last_text || title != last_title || last_chapters != chapters_enabled || last_titlee != title_enabled) {
                updateText(chapterName, title, title_enabled, chapters_enabled);
              }

              last_text = chapterName;
              last_title = title;
              last_chapters = chapters_enabled;
              last_titlee = title_enabled ;
            }
          }
        });
      }, 1000);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension isntalled");
  chrome.storage.sync.set({ uuid });
  chrome.storage.sync.set({ server_url });
  chrome.storage.sync.set({ enabled });
  chrome.storage.sync.set({ display_title });
  chrome.storage.sync.set({ display_chapters });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    chrome.storage.sync.get("enabled", ({ enabled }) => {
      console.log("enabled", enabled)
      if(enabled == true){
        console.log("Inserting script")
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scan,
      });
    }
    });
  }
});
