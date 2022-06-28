// Initialize button with user's preferred color

// The body of this function will be executed as a content script inside the
  // current page

const server_url = "https://Yt-chapters-extension.omega77073.repl.co"

chrome.storage.sync.get("uuid", ({ uuid }) => {
    document.getElementById("token").value = uuid;
    document.getElementById("obs").value = "https://Yt-chapters-extension.omega77073.repl.co/instances?uuid="+uuid;
});

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
        //scrap part
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

document.getElementById("create").addEventListener("click", async () => {
  console.log("Creating instance...")
  let rawResponse = await fetch(server_url+"/create", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  const content = await rawResponse.json();
  uuid = content.uuid

  chrome.storage.sync.set({uuid});
  document.getElementById("token").value = uuid;
  document.getElementById("obs").value = "https://Yt-chapters-extension.omega77073.repl.co/instances?uuid="+uuid;
});

document.getElementById("start").addEventListener("click", async () => {
  console.log("Starting...")

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scan,
  });
});
 