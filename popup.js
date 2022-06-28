// Initialize button with user's preferred color

// The body of this function will be executed as a content script inside the
// current page

const server_url = "https://Yt-chapters-extension.omega77073.repl.co";

chrome.storage.sync.get("uuid", ({ uuid }) => {
  document.getElementById("token").value = uuid;

  if(uuid == "No token found"){
    document.getElementById("obs").value = "No token found"
  }else{
    document.getElementById("obs").value = "https://Yt-chapters-extension.omega77073.repl.co/instances?uuid=" + uuid;
  }

});

chrome.storage.sync.get("display_chapters", ({ display_chapters }) => {
  document.getElementById("chapters").checked = display_chapters
})
chrome.storage.sync.get("display_title", ({ display_title }) => {
  document.getElementById("title").checked = display_title
})
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

document.getElementById("create").addEventListener("click", async () => {
  console.log("Creating instance...");
  let rawResponse = await fetch(server_url + "/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const content = await rawResponse.json();
  uuid = content.uuid;

  chrome.storage.sync.set({ uuid });
  document.getElementById("token").value = uuid;
  document.getElementById("obs").value =
    "https://Yt-chapters-extension.omega77073.repl.co/instances?uuid=" + uuid;
});

document.getElementById("start").addEventListener("click", async () => {
  console.log("Starting...");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  enabled = true;
  chrome.storage.sync.set({ enabled });
  console.log("Injecting script...");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scan,
  });
});

document.getElementById("stop").addEventListener("click", async () => {
  console.log("Stopping...");
  enabled = false;
  chrome.storage.sync.set({ enabled });
});

document.getElementById("chapters").addEventListener("click", async () => {
  display_chapters = document.getElementById("chapters").checked;
  chrome.storage.sync.set({ display_chapters });
});

document.getElementById("title").addEventListener("click", async () => {
  display_title = document.getElementById("title").checked;
  chrome.storage.sync.set({ display_title });
});


function updateStatus(){
  chrome.storage.sync.get("enabled", ({ enabled }) => {
    if(enabled == true){
      document.getElementById("status").innerHTML = "Status: Running"
      document.getElementById("status").style.color = "green";
    }else{
      document.getElementById("status").innerHTML = "Status: Not running"
      document.getElementById("status").style.color = "red";
    }
})
}

setInterval(updateStatus,2000)
updateStatus()