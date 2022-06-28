uuid = "No token found"
server_url = "https://Yt-chapters-extension.omega77073.repl.co"

function scan() {
    chrome.storage.sync.get("uuid", ({ uuid }) => {
      if(uuid=="No token found"){
        console.log("No token found")
        return}
      chrome.storage.sync.get("server_url", ({ server_url }) => {
        let url = window.location.href
        let domain = (new URL(url));
        domain = domain.hostname.replace('www.','');
        console.log(domain,server_url,uuid)
        if(!domain == "youtube.com"){
          console.log("This plugin only works for youtube.com")
          return}
  
        let description = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-chapter-container > button > div.ytp-chapter-title-content").innerText
  
        async function updateText(text){ 
          console.log("Updating text:", text)
          let rawResponse = await fetch(server_url+"/update", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({"text":text, "uuid":uuid})
          });
        }
        last_text = ""
        setInterval((()=>{
          //Merci Brunk_Mortel pour la query
         let chapterName = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-chapter-container > button > div.ytp-chapter-title-content").innerText || "No chapter found";
         if(!chapterName){
          //On peut essayer de récup des trucs?
  
         }else{
          if(chapterName != last_text){
            updateText(chapterName)
          }
          last_text = chapterName
         }
        }),1000);
      })
    });
  }


  
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension isntalled")
    chrome.storage.sync.set({uuid});
    chrome.storage.sync.set({server_url});
});
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    console.log("Injecting code..1")
    if (changeInfo.status == 'complete' && tab.active) {
        console.log("Injecting code..")
  
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scan,
          });
  
    }
  })
