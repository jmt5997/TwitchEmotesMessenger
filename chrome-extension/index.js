//loads css file
function loadCSS(file) {
  let link = document.createElement("link");
  link.href = chrome.extension.getURL(file + '.css');
  link.id = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

//unloads css file
function unloadCSS(file) {
  let cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}

//load the emotes json into a global variable
function saveJson(emotesJson) {
  window.emotesJson = emotesJson;
  window.emotesJson.emotes.sort((a, b) => (a.name < b.name) ? 1 : -1);
  //for documentation purposes only
  //   let readme = "";
  //   for (j = 0; j < window.emotesJson.emotes.length; j++) {
  //      readme += "|" + window.emotesJson.emotes[j].name + ' | ![' + window.emotesJson.emotes[j].name + "](" + window.emotesJson.emotes[j].url + ")|\n" ;
  //   }
  //   console.log(readme);
}

//Classchanged function for the MutationObserver for active conversation
function classChanged() {
  let act = document.getElementsByClassName("i224opu6")[0];
  window.convoSwitchOB.observe(act, {
    attributes: true,
    attributeFilter: ["class"]
  });

  //implementing the observe for newMessageob
  let newMOBSetter = setInterval(function() {
    if (document.querySelectorAll('[aria-label="Messages"]')[0] != null) {
      window.newMesssageOb.observe(document.querySelectorAll('[aria-label="Messages"]')[0], {
        childList: true,
        subtree: true
      });
      clearInterval(newMOBSetter);
    }
  }, 100);
}

//tags all emotes
function tagEmotes() {
  if (window.messageList.length <= 0) {
    setTimeout(function() {
      tagEmotes();
    }, 500);
  } else {
    //for message text
    for (i = 0; i < window.messageList.length; i++) {
      if (!window.messageList[i].hasAttribute("EmoteChecked")) {
        for (j = 0; j < window.emotesJson.emotes.length; j++) {
          let emoteName = window.emotesJson.emotes[j].name;
          let emoteURL = window.emotesJson.emotes[j].url;

          let str = window.messageList[i].innerHTML;


          if (str == emoteName) { //Message is one emote
            let res = "<span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>";
            window.messageList[i].innerHTML = res;
            break;
          } else if (str.includes(emoteName)) { //Message is multiple emotes
            //spaces
            let res = str.replace(new RegExp(emoteName + " ", 'g'), "<span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span> ");
            res = res.replace(new RegExp(" " + emoteName, 'g'), " <span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>");
            //new lines
            res = res.replace(new RegExp(emoteName + "\n", 'g'), "<span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>\n");
            res = res.replace(new RegExp("\n" + emoteName, 'g'), "\n<span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>");
            //punctuation
            res = res.replace(new RegExp(" " + emoteName + "!", 'g'), " <span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>!");
            res = res.replace(new RegExp(" " + emoteName + "\\.", 'g'), " <span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>.");
            res = res.replace(new RegExp(" " + emoteName + ",", 'g'), " <span class=\"emote\">" + emoteName + "<img class=\"textHover\" style=\"display:none\" src=\"" + emoteURL + "\"></span>,");
            window.messageList[i].innerHTML = res;
          }
        }
        //set the emotechecked attribute
        let att = document.createAttribute("EmoteChecked");
        window.messageList[i].setAttributeNode(att);
      }
    }
  }
}

//replace all emotes
function replaceEmotes() {
  // console.log("Emotes Successfully Replaced");
  if (window.messageList.length <= 0) {
    setTimeout(function() {
      replaceEmotes();
    }, 500);
  } else {
    //for quoted text
    let quoteList = document.getElementsByClassName("_4k7e _4ik4 _4ik5");
    for (i = 0; i < quoteList.length; i++) {
      if (!quoteList[i].hasAttribute("EmoteChecked")) {
        for (j = 0; j < window.emotesJson.emotes.length; j++) {
          // console.log(quoteList[i].innerHTML + ", " + window.emotesJson.emotes[j].name + ', ' + window.emotesJson.emotes[j].url);
          let emoteName = window.emotesJson.emotes[j].name;
          let emoteURL = window.emotesJson.emotes[j].url;

          let str = quoteList[i].innerHTML;


          if (str == emoteName) { //Message is one emote
            let res = "<img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>";
            quoteList[i].innerHTML = res;
            break;
          } else if (str.includes(emoteName)) { //Message is multiple emotes
            //spaces
            let res = str.replace(new RegExp(emoteName + " ", 'g'), "<img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"> ");
            res = res.replace(new RegExp(" " + emoteName, 'g'), " <img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">");
            //new lines
            res = res.replace(new RegExp(emoteName + "\n", 'g'), "<img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">\n");
            res = res.replace(new RegExp("\n" + emoteName, 'g'), "\n<img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">");
            //punctuation
            res = res.replace(new RegExp(" " + emoteName + "!", 'g'), " <img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">!");
            res = res.replace(new RegExp(" " + emoteName + "\\.", 'g'), " <img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">.");
            res = res.replace(new RegExp(" " + emoteName + ",", 'g'), " <img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\">,");
            quoteList[i].innerHTML = res;
          }
        }
        //set the emotechecked attribute
        let att = document.createAttribute("EmoteChecked");
        quoteList[i].setAttributeNode(att);
      }
    }

    //for message text
    for (i = 0; i < window.messageList.length; i++) {
      if (!window.messageList[i].hasAttribute("EmoteChecked")) {
        for (j = 0; j < window.emotesJson.emotes.length; j++) {
          // console.log(window.messageList[i].innerHTML + ", " + window.emotesJson.emotes[j].name + ', ' + window.emotesJson.emotes[j].url);
          let emoteName = window.emotesJson.emotes[j].name;
          let emoteURL = window.emotesJson.emotes[j].url;

          let str = window.messageList[i].innerHTML;


          if (str == emoteName) { //Message is one emote
            let res = "<span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>";
            window.messageList[i].innerHTML = res;
            break;
          } else if (str.includes(emoteName)) { //Message is multiple emotes
            //spaces
            let res = str.replace(new RegExp(emoteName + " ", 'g'), "<span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span> ");
            res = res.replace(new RegExp(" " + emoteName, 'g'), " <span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>");
            //new lines
            res = res.replace(new RegExp(emoteName + "\n", 'g'), "<span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>\n");
            res = res.replace(new RegExp("\n" + emoteName, 'g'), "\n<span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>");
            //punctuation
            res = res.replace(new RegExp(" " + emoteName + "!", 'g'), " <span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>!");
            res = res.replace(new RegExp(" " + emoteName + "\\.", 'g'), " <span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>.");
            res = res.replace(new RegExp(" " + emoteName + ",", 'g'), " <span class=\"emote\" data=\"" + emoteName + "\"><img src=\"" + emoteURL + "\" alt=\"" + emoteName + "\"></span>,");
            window.messageList[i].innerHTML = res;
          }
        }
        //set the emotechecked attribute
        let att = document.createAttribute("EmoteChecked");
        window.messageList[i].setAttributeNode(att);
      }
    }
  }
}


///////////////////////////////////Start the scripts///////////////////////////////////
//load the storage variables
//get the emote_replace
chrome.storage.local.get({
  emote_replace: 'on'
}, function(data) {
  if (data.emote_replace == 'off') {
    window.emoteReplace = false;
  } else {
    window.emoteReplace = true;
  }
  //get emote_hover
  chrome.storage.local.get({
    emote_hover: 'on'
  }, function(data) {
    if (data.emote_hover == 'off') {
      window.emoteHover = false;
    } else {
      window.emoteHover = true;
    }
    if (window.emoteHover) {
      if (window.emoteReplace) {
        loadCSS('emoteHover')
      } else {
        loadCSS('txtHover');
      }
    }
  });
});

//to load at the start of the DOM after it has been dynamically built
let start = setInterval(function() {
  console.log("Twitch Emotes Loading...");

  //wait for react to build messenger page only load after a message element has been detected
  if (document.querySelectorAll('[data-testid="messenger_incoming_text_row"]').length + document.querySelectorAll('[data-testid="outgoing_message"]').length > 0) {

    //set the messageList HTMLCollection
    window.messageList = document.getElementsByClassName("ljqsnud1");

    //get the emotes json
    //first try the server
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/suitangi/TwitchEmotesMessenger/master/chrome-extension/emotes.json", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4  && this.status == 200) {
        //when readyState is 4 and status is 200, the response is ready
        var resp = JSON.parse(xhr.responseText);
        console.log("Successfully connected to cloud emote list");
        saveJson(resp);
      } else if (xhr.readyState == 404) {
        //can't connect to server for updated json, use local json
        console.log("Couldn't connect to cloud emote list, using local list (might have less emotes).");
        const jsonUrl = chrome.runtime.getURL('emotes.json');
        fetch(jsonUrl)
          .then((response) => response.json()) //assuming file contains json
          .then((json) => saveJson(json));
      }
    }
    xhr.send();


    //MutationObserver for switching conversations
    window.convoSwitchOB = new MutationObserver(function() {
      setTimeout(function() {
        if (window.emoteReplace) {
          replaceEmotes();
        } else {
          tagEmotes();
        }
      }, 500);
      classChanged();
    });
    let act = document.getElementsByClassName("i224opu6")[0];
    window.convoSwitchOB.observe(act, {
      attributes: true,
      attributeFilter: ["class"]
    });


    //the mutation observer for new messages
    window.newMesssageOb = new MutationObserver(function() {
      setTimeout(function() {
        if (window.emoteReplace) {
          replaceEmotes();
        } else {
          tagEmotes();
        }
      }, 500);
    });

    //implementing the observe for newMessageob
    let newMOBSetter = setInterval(function() {
      if (document.querySelectorAll('[aria-label="Messages"]')[0] != null) {
        window.newMesssageOb.observe(document.querySelectorAll('[aria-label="Messages"]')[0], {
          childList: true,
          subtree: true
        });
        clearInterval(newMOBSetter);
      }
    }, 100);

    //clears the start loop after successfully starting
    clearInterval(start);
  }

}, 1000);
